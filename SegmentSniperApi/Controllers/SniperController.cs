﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using SegmentSniper.Api.ActionHandlers.SniperActionHandlers;
using SegmentSniper.Api.Controllers.Contracts;
using System.Security.Claims;

namespace SegmentSniper.Api.Controllers
{
    [Authorize]
    [EnableCors("AllowReactApp")]
    [Route("api/[controller]")]
    [ApiController]
    public class SniperController : ControllerBase
    {
        private readonly IGetActivityListForTimeRangeActionHandler _getActivityListForTimeRangeActionHandler;
        private readonly IGetActivityListByIdActionHandler _getActivityListByIdActionHandler;
        private readonly IGetDetailedActivityByIdActionHandler _getDetailedActivityByIdActionHandler;
        private readonly ISnipeSegmentsActionHandler _snipeSegmentsActionHandler;

        public SniperController(IGetActivityListForTimeRangeActionHandler getActivityListForTimeRangeActionHandler, IGetActivityListByIdActionHandler getActivityListByIdActionHandler, IGetDetailedActivityByIdActionHandler getDetailedActivityByIdActionHandler, ISnipeSegmentsActionHandler snipeSegmentsActionHandler)
        {
            _getActivityListForTimeRangeActionHandler = getActivityListForTimeRangeActionHandler;
            _getActivityListByIdActionHandler = getActivityListByIdActionHandler;
            _getDetailedActivityByIdActionHandler = getDetailedActivityByIdActionHandler;
            _snipeSegmentsActionHandler = snipeSegmentsActionHandler;
        }


        [HttpPost]
        [Authorize]
        [Route("getActivityListForDateRange")]
        public IActionResult GetActivityListForTimeRange([FromBody] GetActivityListForTimeRangeContract contract)
        {
            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier).ToString();

            var request = new GetActivityListForTimeRangeRequest(userId, (DateTime)contract.StartDate, (DateTime)contract.EndDate, contract.ActivityType);

            var returnList = _getActivityListForTimeRangeActionHandler.Handle(request).Result;

            if (returnList != null)
                return Ok(returnList);
            else
                return StatusCode(421, "Unable to fetch activities.");
        }

        [HttpGet]
        [Authorize]
        [Route("getActivityListById/$activityId")]
        public IActionResult GetActivityListById(string activityId)
        {
            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier).ToString();
            var request = new GetActivityListByIdRequest(userId, activityId);
            var returnList = _getActivityListByIdActionHandler.Handle(request).Result;

            if (returnList != null)
                return Ok(returnList);
            else
                return StatusCode(421, $"Unable to fetch activity Id: {activityId}.");
        }


        [HttpGet]
        [Authorize]
        [Route("getDetailedActivityById/$activityId")]
        public IActionResult GetDetailedActivityById(string activityId)
        {

            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier).ToString();
            var request = new GetDetailedActivityByIdRequest(userId, activityId);
            var returnList = _getDetailedActivityByIdActionHandler.Handle(request).Result;

            if (returnList != null)
                return Ok(returnList);
            else
                return StatusCode(421, $"Unable to fetch activity Id: {activityId}.");
        }


        [HttpPost]
        [Authorize]
        [Route("snipeSegments")]
        public IActionResult SnipeSegments([FromBody] SegmentSniperContract contract)
        {
            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier).ToString();
            var request = new SnipeSegmentsRequest
            {
                UserId = userId,
                ActivityId = contract.ActivityId,
                SecondsFromKom = contract.SecondsOff,
                PercentageFromKom = contract.PercentageOff,
                UseQom = contract.UseQom,
            };

            var returnList = _snipeSegmentsActionHandler.Handle(request).Result;

            if (returnList != null)
                return Ok(returnList);
            else
                return StatusCode(421, "Unable to snipe segments.");
        }


        [HttpPost]
        [Authorize]
        [Route("starSegment/$segmentId")]
        public IActionResult StarSegment(string segmentId)
        {
            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier).ToString();

            throw new NotImplementedException();
        }
        //get detailed segment by ID

    }
}
