import React,{useEffect,useState} from 'react';
import ReactRoundedImage from "react-rounded-image";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { ref as refStorage,getDownloadURL,getStorage } from 'firebase/storage';
import { ref,get,child, getDatabase, set } from 'firebase/database';

const ProfileCard=(props)=>{
    const [image, setImage] = useState("https://bootdey.com/img/Content/avatar/avatar7.png");
    const [fullName, setFullName] = useState('');

    const [email, setEmail] = useState('email');
    const [emailVerified, setEmailVerified] = useState(false);
    const [phone, setPhone] = useState('xxxxxxxxxxx');
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                setEmail(user.email);
                setEmailVerified(user.emailVerified);
                setPhone(user.phoneNumber);

            } else {
                // User is signed out
                alert('An unhandled error occured')
            }
        });
        var user = auth.currentUser;
        if(user==null){
            return;
        }
        //get values from database
        const dbRef = ref(getDatabase());
        get(child(dbRef, 'profileData/'+user.uid))
        .then((snapshot) => {
        if (snapshot.exists()) {
            setFullName(snapshot.val().fullName);
        } else {
            console.log("No data available");
        }
        }).catch((error) => {
        console.error(error);
        });
            
            //get profile image from storage
            getDownloadURL(refStorage(getStorage(), user.uid+'/profile/profileImage.jpg'))
            .then((url) => {
                // `url` is the download URL for 'images/stars.jpg'

                // set image state
                setImage(url);
            })
            .catch((error) => {
                // Handle any errors
                console.log('Error downloading image:'+error.message);
            });
    }, []);

    const verifyEmailHandler=()=>{
        alert('Service currently unavailable');
    }
    
    return(
        <div className="card" >
            <div className="card-body">
                <div className="d-flex flex-column" style={{ justifyContent:'center',alignItems:'center'}}>
                    <ReactRoundedImage image={image?image:"https://bootdey.com/img/Content/avatar/avatar7.png"} />
                    <div className="mt-3">
                    <h4>{fullName}</h4>
                    <p className="text-secondary mb-1">{email}:{emailVerified?<span className='text-success'>Verified</span>:<span><p className='text-info' role='button' onClick={verifyEmailHandler}>Verify Now</p></span>}</p>
                    <p className="text-muted font-size-sm">{phone}</p>
                    <center>
                    {props.profileButton?<a href="/userProfile"><button type="button" className="btn btn-dark rounded-0" style={{background:'rgb(0,0,0,0.8)'}}>Profile</button></a>:''}
                    
                    {props.accountButton?<a href="/account"><button className="btn btn-dark rounded-0 m-3" style={{background:'rgb(0,0,0,0.8)'}}>Account</button></a>:''}
                    </center>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard;