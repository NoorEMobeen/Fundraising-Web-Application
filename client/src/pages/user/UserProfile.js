import './../../components/constants/style.css';
import Header from './../../components/Header';
import ReactRoundedImage from "react-rounded-image";
import React,{useState,useEffect} from 'react';
import {auth} from "../../components/firebase/config";
//import { ref,get,set,child } from 'firebase/database';
import { ref as refStorage,getDownloadURL,getStorage, uploadBytesResumable } from 'firebase/storage';
import { ref,set,get,child, getDatabase } from 'firebase/database';
import Tabs from './Tabs';
import {useFormik} from 'formik';
import {SERVER_NAME} from '../../components/config/config';
import { ProgressBar } from 'react-bootstrap';
import PuffLoader from "react-spinners/PuffLoader";
import axios from 'axios';

const UserProfile=(props)=>{
    const [showLoader, setShowLoader] = useState(false);
    const [image, setImage] = useState("https://bootdey.com/img/Content/avatar/avatar7.png");
    const [imageUploadProgress, setImageUploadProgress] = useState(0);
    const initialValues={
        fullName:"",
        website:"",
        twitter:"",
        instagram:"",
        facebook:""
    }

    const onSubmit=values=>{
        setShowLoader(true);
        var user = auth.currentUser;
        //write data to realtime database
        set(ref(getDatabase(), 'profileData/'+ user.uid), {
            fullName:values.fullName,
            website:values.website,
            twitter:values.twitter,
            instagram:values.instagram,
            facebook:values.facebook
        }).then((res)=>{
            alert("Data Updated Successfully");
            setShowLoader(false);
        }).catch((err)=>{
            alert("unknown error occured");
            setShowLoader(false);
        });

        // .then((snapshot) => {

        //     alert('Uploaded a blob or file!');
        // });
        
        // const dataToSend={
        //     fullName:values.fullName,
        //     website:values.website,
        //     twitter:values.twitter,
        //     instagram:values.instagram,
        //     facebook:values.facebook
        // }
        // //Resume here
        // const config = {
        //     headers: {
        //       Authentication: ,
        //     }
        //   }
        // axios.post(SERVER_NAME+'/profileDataPost',dataToSend,)
        
    }

    const validate=values=>{

    }

    const formik=useFormik({
        initialValues,
        onSubmit,
        validate
    });

    const uploadProfileImage=()=>{
        var user = auth.currentUser;

        //write file(s) to storage in file or blob format
        const storageRef = refStorage(getStorage(), user.uid+'/profile/profileImage.jpg');
        const metadata = {
            contentType: 'image/jpeg',
          };          
        // 'file' comes from the Blob or File API
        const uploadTask = uploadBytesResumable(storageRef, document.getElementById('profileImage').files[0],metadata);
        
        uploadTask.on('state_changed', 
        (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            setImageUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log('Upload is ' + imageUploadProgress + '% done');
            switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
            }
        }, 
        (error) => {
            // Handle unsuccessful uploads
        }, 
        () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            });
        }
        );
    }
    //const [imageFile, setImageFile] = useState(new File());
    // useEffect(() => {
    //     var user = auth.currentUser;

    //         // ...
    //     setTimeout(()=>{
    //         user = auth.currentUser;
    //         if(user==null) {
    //             return;
    //         }

    //         const dbRef = ref(realtimeDB);
    //         get(child(dbRef, `profileData/${user.uid}`)).then((snapshot) => {
    //             if (snapshot.exists()) {
    //                 const fetchedProfileData=snapshot.val();

    //                 setFullName(fetchedProfileData.fullName);
    //                 setDesignation(fetchedProfileData.designation);
    //                 setAddress(fetchedProfileData.address);
    //                 setWebsite(fetchedProfileData.website);
    //                 setTwitter(fetchedProfileData.twitter);
    //                 setInstagram(fetchedProfileData.instagram);
    //                 setFacebook(fetchedProfileData.facebook);
    //             } else {
    //                 alert("data fetching error")
    //             }
    //         });

    //         getDownloadURL(refStorage(storage, auth.currentUser.uid+'/profileImage.jpg')).then((url) => {
    //             // This can be downloaded directly:
    //             const xhr = new XMLHttpRequest();
    //             xhr.responseType = 'blob';
    //             xhr.onload = (event) => {
    //             const blob = xhr.response;
    //             };
    //             xhr.open('GET', url);
    //             xhr.send();

    //             // Or inserted into an <img> element
    //             setImage(url);
    //         }).catch((error) => {});
    //     },3000);
        
    // },[]);

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
          let reader = new FileReader();
          reader.onload = () => {
            setImage(reader.result);
          };
          reader.readAsDataURL(event.target.files[0]);
          uploadProfileImage();
        }
    }
    
    useEffect(() => {
        var user = auth.currentUser;
        if(user==null){
            return;
        }
        //get values from database
        const dbRef = ref(getDatabase());
        get(child(dbRef, 'profileData/'+user.uid)).then((snapshot) => {
        if (snapshot.exists()) {
            formik.setValues({
                fullName:snapshot.val().fullName,
                website:snapshot.val().website,
                twitter:snapshot.val().twitter,
                instagram:snapshot.val().instagram,
                facebook:snapshot.val().facebook
            })
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

    return(
        <>
            <div className='some-page-wrapper'>
                <div className='row'>
                    
                    <div className='column'>
                        <div className="card item-align-center" >
                            <form onSubmit={formik.handleSubmit}>
                                <div className="card-body">
                                    <div className="d-flex flex-column text-center" >
                                        <center>
                                            <div className="d-flex flex-column text-center" >
                                                <ReactRoundedImage image={image} /> 
                                                <input type="file" onChange={onImageChange} accept="image/*" id="profileImage" name="profileImage"/>
                                                <ProgressBar striped variant="info" now={imageUploadProgress} style={{height:'4px'}}/>
                                                <br/>                                                
                                                <div className="mt-3">
                                                <label for="fullName">Full name</label>
                                                <input type="text" value={formik.values.fullName} onChange={formik.handleChange} id='fullName' name='fullName'  placeholder="Enter your full name"/>
                                                </div>
                                            </div>
                                        </center>
                                    </div>
                                    <div className="card mt-1" style={{marginTop:'5px'}}>
                                    <ul className="list-group list-group-flush">
                                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                        <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-globe mr-2 icon-inline"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>Website</h6>
                                        <span><input type="text" value={formik.values.website} onChange={formik.handleChange}  id="googlePlus" name="website" placeholder="website link" /></span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                        <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-twitter mr-2 icon-inline text-info"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>Twitter</h6>
                                        <span><input type="text" value={formik.values.twitter} onChange={formik.handleChange}  id="twitter" name="twitter" placeholder="Twitter username" /></span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                        <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-instagram mr-2 icon-inline text-danger"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>Instagram</h6>
                                        <span><input type="text" value={formik.values.instagram} onChange={formik.handleChange}  id="instagram" name="instagram" placeholder="Instagram username" /></span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                        <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-facebook mr-2 icon-inline text-primary"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>Facebook</h6>
                                        <span><input type="text" value={formik.values.facebook} onChange={formik.handleChange}  id="facebook" name="facebook" placeholder="Facebook username" /></span>
                                    </li>
                                    </ul>
                                </div>
                                <input type="submit" className="btn btn-dark" style={{backgroundColor:'rgb(0,0,0,0.8)', marginTop:'20px'}} value="Save this"/>
                                {showLoader?<PuffLoader size={50}/>:''}
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className='triple-column'>
                        <div className="card" style={{marginLeft:'5px', height:'100%'}} >
                            <div className="card-body" >
                                <Tabs/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default UserProfile;