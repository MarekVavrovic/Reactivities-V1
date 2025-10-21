import { Box, Typography } from "@mui/material";
import ActivityCard from "./ActivityCard";
import { UseActivities } from "../../../lib/hooks/UseActivities";

export default function ActivityList() {
  
  const { activities,isLoading  } = UseActivities();

   if (isLoading) return <Typography>Loading...</Typography>

  if (!activities) return <Typography>No activities found. You can create one...</Typography>
  
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