import { useAppStore } from "@/store";
import React from "react";

const Profile = () => {
  const { userInfo } = useAppStore();

  //debugger;
  console.log("userInfo", userInfo);

  return (
    <div>
      profile page
      <div>
        <h2>User Information</h2>
        {userInfo ? (
          <div>
            <p>
              <strong>Name:</strong> {userInfo.firstname} {userInfo.lastname}
            </p>
            <p>
              <strong>Email:</strong> {userInfo.email}
            </p>
          </div>
        ) : (
          <p>No user information available.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
