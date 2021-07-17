import React, { useState } from "react";
import { authService, storageService } from "fbase";
import { useHistory } from "react-router-dom";

export default ({refreshUser, userObj}) => {
  const [attachment, setAttachment] = useState(userObj.photoURL);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const onChange = (event) =>{
    const{
      target: {value},
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if(userObj.photoURL == attachment && userObj.displayName == newDisplayName){
      return;
    }

    if(userObj.photoURL !== attachment){
      const deleteRef = storageService.ref().child(`${userObj.uid}/profilePhoto`);
      deleteRef.delete();
      const attachmentRef = storageService.ref().child(`${userObj.uid}/profilePhoto`);
      const response = await attachmentRef.putString(attachment, "data_url");
      const attachmentUrl = await response.ref.getDownloadURL()
      await userObj.updateProfile({
          photoURL: attachmentUrl
      });
    }

    if(userObj.displayName !== newDisplayName){
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
    }
    refreshUser();
  };
  const onFileChange = (event) => {
    const { target:{files}} = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent)=>{
      const {currentTarget:{result}} = finishedEvent;
      setAttachment(result);
    }
    reader.readAsDataURL(theFile);
  }
  return (                                                          //profile Page
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
         <label for="profile_attach" className="profileForm__label" >
                <img src={attachment} width="100px" height="100px" />
        </label>
        <input
          id="profile_attach"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{opacity: 0}}
          />
        <input 
          onChange={onChange}
          type="text"
          autoFocus
          placeholder="Display name"
          value={newDisplayName}
          className="formInput"
          />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};