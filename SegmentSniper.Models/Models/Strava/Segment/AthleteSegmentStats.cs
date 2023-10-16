﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SegmentSniper.Models.Models.Strava.Segment
{
    public class AthleteSegmentStats
    {
        public int PrElapsedTime { get; set; }
        public string PrDate { get; set; }
        public long PrActivityId { get; set; }
        public int EffortCount { get; set; }
    }
}
