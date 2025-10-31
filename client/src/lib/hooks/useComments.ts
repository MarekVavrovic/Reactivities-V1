import { useLocalObservable } from "mobx-react-lite";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";
import { useEffect, useRef } from "react";
import { runInAction } from "mobx";

export const useComments = (activityId?: string) => {
  const created = useRef(false);
  const commentStore = useLocalObservable(() => ({
    //create observable.
    comments: [] as ChatComment[],
    hubConnection: null as HubConnection | null,

    //create connection
    createHubConnection(activityId: string) {
      if (!activityId) return;

      this.hubConnection = new HubConnectionBuilder()
        .withUrl(
          `${import.meta.env.VITE_COMMENTS_URL}?activityId=${activityId}`,
          {
            withCredentials: true,
          }
        )
        .withAutomaticReconnect()
        .build();

      //start connection
      this.hubConnection
        .start()
        .catch((error) =>
          console.log("Error establishing connection: ", error)
        );

      //load comments
      this.hubConnection.on("LoadComments", (comments) => {
        runInAction(() => {
          this.comments = comments;
        });
      });

      //receive comments
      this.hubConnection.on("ReceiveComment", (comment) => {
        runInAction(() => {
          this.comments.unshift(comment);
        });
      });
    },

    //stop connection
    stopHubConnection() {
      if (this.hubConnection?.state === HubConnectionState.Connected) {
        this.hubConnection
          .stop()
          .catch((error) => console.log("Error stopping connection: ", error));
      }
    },
  }));

  //useEff
  useEffect(() => {
    if (activityId && !created.current) {
      commentStore.createHubConnection(activityId);
      created.current = true;
    }

    return () => {
      commentStore.stopHubConnection();
      commentStore.comments = [];
    };
  }, [activityId, commentStore]);

  return {
    commentStore,
  };
};
