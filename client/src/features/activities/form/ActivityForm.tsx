import { Box, Button, Paper, Typography } from "@mui/material";
import { UseActivities } from "../../../lib/hooks/UseActivities";
import { useNavigate, useParams } from "react-router";
import { useForm} from "react-hook-form";
import { useEffect } from "react";
import type { ActivitySchema } from "../../../lib/schemas/activitySchema";
import { activitySchema } from "../../../lib/schemas/activitySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../../app/shared/components/TextInput";
import SelectInput from "../../../app/shared/components/SelectInput";
import { categoryOptions } from "./categoryOptions";
import DateTimeInput from "../../../app/shared/components/DateTimeInput";
import LocationInput from "../../../app/shared/components/LocationInput";

export default function ActivityForm() {
  const {
    reset,
    handleSubmit,
    control,    
  } = useForm<ActivitySchema>({
    mode: "onTouched",
    resolver: zodResolver(activitySchema),
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const { updateActivity, createActivity, activity, isLoadingActivity } = UseActivities(id);

useEffect(() => {
  if (activity) reset({
    ...activity,
      location: {
        city: activity.city,
        venue: activity.venue,
        latitude: activity.latitude,
        longitude: activity.longitude
           }
       });
    }, [activity, reset]);

  const onSubmit = async (data: ActivitySchema) => {
    
    const {location, ...rest} = data; 
    const flattenedData = {...rest, ...location};

      try {
       if (activity) {
         updateActivity.mutate({...activity, ...flattenedData}, {
         onSuccess: () => navigate(`/activities/${activity.id}`)
            })
           } else {
            createActivity.mutate(flattenedData, {
            onSuccess: (id) => navigate(`/activities/${id}`)
            })
            }
        } catch (error) {
         console.log(error);
        }
    }

  if (isLoadingActivity) return <Typography>Loading activity...</Typography>;

  return (
    <Paper sx={{ borderRadius: 3, padding: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        {activity ? "Edit activity" : "Create activity"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        display="flex"
        flexDirection="column"
        gap={3}
      >
       <TextInput control={control} name="title" label="Title"/>
       <TextInput control={control} name="description" label="Description" multiline rows={3}/>

       <Box display='flex' gap={3}>
         <SelectInput items={categoryOptions} control={control} name="category" label="Category"/> 
         <DateTimeInput control={control} name="date" label="Date"/>    
       </Box>
          
       <LocationInput control={control} name="location" label="Location"/>
           
        <Box display="flex" justifyContent="end" gap={3}>
          <Button onClick={() => {}} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            color="success"
            variant="contained"
            disabled={updateActivity.isPending || createActivity.isPending}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
