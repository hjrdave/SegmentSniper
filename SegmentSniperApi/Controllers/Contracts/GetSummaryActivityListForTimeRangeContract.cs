﻿namespace SegmentSniper.Api.Controllers.Contracts
{
    public class GetSummaryActivityListForTimeRangeContract
    {
        public DateTime EndDate { get; set; }
        public DateTime StartDate { get; set; }
        public string? ActivityType { get; set; }
    }
}
