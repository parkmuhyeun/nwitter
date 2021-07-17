import React, { useEffect, useState } from 'react';
import AppRouter from "components/Router";
import {authService} from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {                    //Every time userupdate
      if(user){
        setUserObj({
          photoURL: user.photoURL,
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      }else{
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {                                    //userupdate
    const user = authService.currentUser
    setUserObj({
      photoURL: user.photoURL,
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  }
  return (
    <>
      {init ? (                                                  //Init(GetUserData) ?  Router: "Initializing"
              <AppRouter
                refreshUser={refreshUser}
                isLoggedIn={Boolean(userObj)}
                userObj={userObj}
                />
              ):(
                "Initializing..."
                )}
    </>
  );
}

export default App;
