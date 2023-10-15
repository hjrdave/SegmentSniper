import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { ActivityListItem } from "../models/Activity/ActivityListItem";

const persistOptions = {
  name: "activity-list-store",
  storage: createJSONStorage(() => sessionStorage),
};

const devtoolOptions = {
  name: "Activity List Store",
};

const initialState = [{}];

const useActivityListStore = create<ActivityListStore>()(
  immer(
    devtools(
      persist(
        (set) => ({
          activityList: [],
          setActivityList: (activityList: ActivityListItem[]) =>
            set((state) => {
              state.activityList = activityList;
            }),
          resetActivityList: () =>
            set((state) => {
              state.activityList = initialState;
            }),
        }),
        persistOptions
      ),
      devtoolOptions
    )
  )
);

export default useActivityListStore;

interface ActivityListStore {
  activityList: ActivityListItem[];
  setActivityList: (activityList: ActivityListItem[]) => void;
  resetActivityList: () => void;
}
