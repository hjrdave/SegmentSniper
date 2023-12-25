﻿
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SegmentSniper.Api.ActionHandlers.AuthActionHandlers;
using SegmentSniper.Api.ActionHandlers.LoginActionHandlers;
using SegmentSniper.Api.ActionHandlers.StravaApiToken;
using SegmentSniper.Models.Models.Auth;
using SegmentSniper.Models.Models.Auth.User;
using System.Security.Claims;
using static Microsoft.ApplicationInsights.MetricDimensionNames.TelemetryContext;

namespace SegmentSniper.Api.Controllers
{
    [EnableCors("AllowReactApp")]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ILoginUserActionHandler _loginUserActionHandler;
        private readonly IRegisterUserActionHandler _registerUserActionHandler;
        private readonly IRefreshTokenActionHandler _refreshTokenActionHandler;
        private readonly ICheckForStravaTokenActionHandler _checkForStravaTokenActionHandler;
        private readonly IRevokeTokenActionHandler _revokeTokenActionHandler;

        public AuthController(ILoginUserActionHandler loginUserActionHandler, IRegisterUserActionHandler registerUserActionHandler, IRefreshTokenActionHandler refreshTokenActionHandler, ICheckForStravaTokenActionHandler checkForStravaTokenActionHandler, IRevokeTokenActionHandler revokeTokenActionHandler)
        {
            _loginUserActionHandler = loginUserActionHandler;
            _registerUserActionHandler = registerUserActionHandler;
            _refreshTokenActionHandler = refreshTokenActionHandler;
            _checkForStravaTokenActionHandler = checkForStravaTokenActionHandler;
            _revokeTokenActionHandler = revokeTokenActionHandler;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] RegisterUserDto registerUser)
        {
            try
            {
                var registeredUser = await _registerUserActionHandler.Handle(new RegisterUserRequest { User = registerUser });
                if (registeredUser != null)
                {
                    return Ok(registeredUser);
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while processing the request. Error: {ex}");
            }
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLogin userLogin)
        {
            try
            {
                var authenticatedUser = await _loginUserActionHandler.Handle(new LoginUserRequest(userLogin));

                if (authenticatedUser != null && authenticatedUser.TokenData != null)
                {
                    return Ok(authenticatedUser);
                }
                return Unauthorized("Username or password is incorrect");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while processing the request. Error: {ex}");
            }
        }


        [HttpPost]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken(RefreshTokenData refreshToken)
        {
            if (refreshToken is null)
            {
                return BadRequest("Invalid client request");
            }
            else
            {
                try
                {
                    var refreshedToken = await _refreshTokenActionHandler.HandleAsync(new RefreshTokenRequest(refreshToken));
                    if(refreshedToken.RefreshedToken.AccessToken != null)
                    {
                    return Ok(refreshedToken);

                    }
                    else
                    {
                        return BadRequest("Something went wrong");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest($"Invalid access or refresh token: {nameof(refreshToken)}");
                }
            }
        }

        [Authorize]
        [HttpGet]
       [Route("check-for-strava-token")]
        public async Task<IActionResult> CheckForStravaToken()
        {
            try
            {
                var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier).ToString();
                return Ok(_checkForStravaTokenActionHandler.Handle(new CheckForStravaTokenRequest(userId)));

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while processing the request. Error: {ex}");
            }
        }

        [Authorize]
        [HttpPost]
        [Route("revoke/{username}")]
        public async Task<IActionResult> Revoke(string username)
        {
            try
            {
                var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier).ToString();
                var result = await _revokeTokenActionHandler.HandleRevokeSingleUserToken(new RevokeUserTokenRequest(userId));

                if(result.Success)
                    return Ok();
                return BadRequest("Unable to revoke token.");

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while processing the request. Error: {ex}");
            }
        }
    }
}
