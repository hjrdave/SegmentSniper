﻿using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using SegmentSniper.Data.Entities.Auth;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SegmentSniper.Services.AuthServices
{
    public class GetUserRoles : IGetUserRoles
    {
        private readonly UserManager<ApplicationUser> _userMgr;

        public GetUserRoles(UserManager<ApplicationUser> userMgr)
        {
            _userMgr = userMgr;
        }
        public async Task<GetUserRolesContract.Result> Execute(GetUserRolesContract contract)
        {
            var userRoles = await _userMgr.GetRolesAsync(contract.User);

            var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, contract.User.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            return new GetUserRolesContract.Result { Roles = authClaims };
        }
    }
}


