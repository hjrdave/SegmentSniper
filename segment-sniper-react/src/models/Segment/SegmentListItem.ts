import { AthleteSegmentStats } from "./AthleteSegmentStats";
import { Xoms } from "./Xoms";

export interface SegmentListItem {
  segmentId: string;
  segmentEffortId: number;
  name: string;
  time: number;
  distance: number;
  athleteStats?: AthleteSegmentStats;
  koms?: Xoms;
  rank?: number;
  starred: boolean;
}
