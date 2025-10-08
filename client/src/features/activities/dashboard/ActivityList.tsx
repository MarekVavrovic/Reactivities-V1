import { Box, Typography } from "@mui/material";
import ActivityCard from "./ActivityCard";
import { UseActivities } from "../../../lib/hooks/UseActivities";

export default function ActivityList() {
  
  const { activities, isPending } = UseActivities();

  if (!activities || isPending) return <Typography>Loading...</Typography>
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {activities.map(activity => (
        <ActivityCard
          key={activity.id}
          activity={activity}
        />
      ))}
    </Box>
  )
}