import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import agent from "../api/agent";

export const UseActivities = () => {
  const queryClient = useQueryClient();

  //to fetch data use useQuery
  const { data: activities, isPending } = useQuery({
    queryKey: [`activities`],
    queryFn: async () => {
      const response = await agent.get<Activity[]>(`/activities`);
      return response.data;
    },
  });

  //to update data use useMutation
  const updateActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      await agent.put("/activities", activity);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["activities"],
      });
    },
  });

  //create activity
  const createActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      await agent.post("/activities", activity);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["activities"],
      });
    },
  });

  //delete activity
  const deleteActivity = useMutation({
    mutationFn: async (id: string) => {
      await agent.delete(`/activities/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["activities"],
      });
    },
  });

  return { activities, isPending, updateActivity, createActivity,deleteActivity };
};
