//import { right } from '@popperjs/core'
import React,{useState,useEffect} from 'react'
import ReactRoundedImage from "react-rounded-image";
import { auth } from '../../components/firebase/config';
import { ref as refStorage,getDownloadURL,getStorage, uploadBytesResumable } from 'firebase/storage';
import { ref,set,get,child, getDatabase } from 'firebase/database';
import { ProgressBar } from 'react-bootstrap';
import {Tab,Tabs} from 'react-bootstrap';
import PuffLoader from "react-spinners/PuffLoader";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {useFormik} from 'formik';
import axios from 'axios';

function getDatetime() {
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;
    return time_At_date;
 }

const AdminAccount = (props) => {
  const [showLoader, setShowLoader] = useState(false)
  const [image, setImage] = useState("https://bootdey.com/img/Content/avatar/avatar7.png");
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [fullName, setFullName] = useState("");
  const [designation, setDesignation] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationInfo, setOrganizationInfo] = useState({});
  
  useEffect(async() => {
    const user=auth.currentUser;
    //download footer data for fields
    axios.get('/footer/links')
    .then(res => {
        setOrganizationInfo(res.data[0]);
    })
    .catch(err => {
        console.log(err);
    })
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
  
const formInfoSubmitHandler=(e)=>{
  e.preventDefault();
    setShowLoader(true)
  //upload data to realtime database
  set(ref(getDatabase(), '/profileData/' + auth.currentUser.uid), {
    designation:designation,
    address:address,
    contact:contact,
    accountNumber:accountNumber,
    website:website,
    twitter:twitter,
    instagram:instagram,
    facebook:facebook,
    bankName:'easypaisa'
    }).then(res=>{
        alert('Record updated Successfully!')
        setShowLoader(false);
    }).catch(err=>{
        alert("Some Error occured while trying to update!\nPlease try again later.");
        console.log(err)
        setShowLoader(false);
    });
}

const addAdminSubmitHandler=(e)=>{
    e.preventDefault();
    if(!email || !password){
        alert('Please enter Email and Password first!');
        return;
    }
    setShowLoader(true);
    //make a new admin account
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          set(ref(getDatabase(), '/roles/admin/'+ userCredential.user.uid), {
                active_status: true,
                created_at:getDatetime(),
                fullName: fullName,
                email: email
            });
          set(ref(getDatabase(), '/profileData/' + userCredential.user.uid), {
            fullName: fullName,
            email: email
            });
            console.log('New Role Added successfully');
            alert("Admin Created Successfuly!")
            setShowLoader(false);
        })
        .catch((error) => {
          const errorMessage = error.message;
          setShowLoader(false)
          alert('ERROR: '+errorMessage);
        });
}

const addAdminChangeHandler=(e)=>{
    switch (e.target.name) {
        case "fullName":
            setFullName(e.target.value);
            break;
        case "password":
            setPassword(e.target.value);
            break;
        case "email":
            setEmail(e.target.value);
            break;
        default:
            break;
    }
}


const infoChangeHandler=(e)=>{
    switch (e.target.name) {
        case "fullName":
            setFullName(e.target.value);
            break;
        case "designation":
            setDesignation(e.target.value);
            break;
        case "address":
            setAddress(e.target.value);
            break;
        case "contact":
            setContact(e.target.value);
            break;
        case "accountNumber":
            setAccountNumber(e.target.value);
            break;
        case "website":
            setWebsite(e.target.value);
            break;
        case "twitter":
            setTwitter(e.target.value);
            break;
        case "instagram":
            setInstagram(e.target.value);
            break;
        case "facebook":
            setFacebook(e.target.value);
            break;
        default:
            break;
    }
}

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

 const initialValues = {
    aim: organizationInfo.aim || '',
    vision: organizationInfo.vision || '',
    contactLink: organizationInfo.contactLink || '',
    contactText: organizationInfo.contactText || '',
    facebook: organizationInfo.facebook || '',
    linkedIn: organizationInfo.linkedIn || '',
    twitter: organizationInfo.twitter || '',
    
 }
 const onSubmit = (values) => {
     var data={}
     for (const key in values) {
         if(values[key]){
            data ={...data,[key]:values[key]}
         }
     }
    const body ={
        id:'sGYqHcyvacs3cderErpx',
        ...data
    }
    axios.put('/footer/links',body)
    .then(res=>{
        alert('Data Updated Successfully!');
    }).catch(err=>{
        alert('Error Occured!')
    });
 }

 const formik =useFormik({
    initialValues,
    onSubmit,
 });

return (
    <div className='some-page-wrapper'>
        <div className='row'>
            <div className='column'>
                <div className="card align-items-center" >
                    <div className="card-body">
                        <div className="d-flex flex-column text-center align-items-center" >
                            <ReactRoundedImage image={image? image:"https://bootdey.com/img/Content/avatar/avatar7.png"} /> 
                            <input type="file" onChange={onImageChange} accept="image/*" id="profileImage" name="profileImage"/>
                            <ProgressBar striped variant="info" now={imageUploadProgress} style={{height:'4px'}}/>
                        </div>
                        <div className="card mt-1" style={{marginTop:'5px'}}>
                            <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-globe mr-2 icon-inline"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>Website</h6>
                                <span><input type="text" value={website} onChange={infoChangeHandler} id="googlePlus" name="website" placeholder="website link" /></span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-twitter mr-2 icon-inline text-info"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>Twitter</h6>
                                <span><input type="text" value={twitter} onChange={infoChangeHandler} id="twitter" name="twitter" placeholder="Twitter username" /></span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-instagram mr-2 icon-inline text-danger"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>Instagram</h6>
                                <span><input type="text" value={instagram} onChange={infoChangeHandler} id="instagram" name="instagram" placeholder="Instagram username" /></span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                <h6 className="mb-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-facebook mr-2 icon-inline text-primary"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>Facebook</h6>
                                <span><input type="text" value={facebook} onChange={infoChangeHandler} id="facebook" name="facebook" placeholder="Facebook username" /></span>
                            </li>
                            </ul>
                        </div>
                        <p>click Save button in My Info Tab to save this information</p>
                    </div>
                  </div>
            </div>
            <div className='triple-column'>
                <div className="card">
                    <div style={{margin:'10%'}}>
                    <Tabs defaultActiveKey="home" id="uncontrolled-tab" className="mb-3" >
                        <Tab eventKey="home" title="Info" >
                            <div className="mt-3">
                                <label for="designation">Designation</label>
                                <input type="text" className='form-control' value={designation} onChange={infoChangeHandler}  placeholder="Type here" id="designation" name="designation"/>
                                <br/>
                                <label for="address">Address</label>
                                <textarea name="address" className='form-control' value={address} onChange={infoChangeHandler}  id="address" cols="20" placeholder="Type here"/>
                                <br/>
                                <label for="contact">Contact Number</label>
                                <input type="number" className='form-control' value={contact} onChange={infoChangeHandler} placeholder="Enter your Contact Number" id="contact" name="contact"/>
                                <br/>
                                <label for="bankName">Account</label>
                                <select className="form-control" name="bankName" id='bankName'>
                                    <option value="Stripe">Stripe</option>
                                    {/* <option value="Allied Bank Limited">Allied Bank Limited</option>
                                    <option value="Askari Bank">Askari Bank</option>
                                    <option value="Bank Alfalah">Bank Alfalah</option>
                                    <option value="Bank AL Habib">Bank AL Habib</option>
                                    <option value="Barclays Bank Pakistan">Barclays Bank Pakistan</option>
                                    <option value="Citibank Pakistan">Citibank Pakistan</option>
                                    <option value="Faysal Bank">Faysal Bank</option>
                                    <option value="First Women Bank">First Women Bank</option>
                                    <option value="Habib Bank Limited/HBL Connect">Habib Bank Limited/HBL Connect</option>
                                    <option value="HSBC Pakistan">HSBC Pakistan</option>
                                    <option value="Mobilink Microfinance/JazzCash">Mobilink Microfinance/JazzCash</option>
                                    <option value="JS Bank">JS Bank</option>
                                    <option value="KASB Bank Ltd">KASB Bank Ltd</option>
                                    <option value="MCB Bank Limited">MCB Bank Limited</option>
                                    <option value="MyBank">MyBank</option>
                                    <option value="National bank of Pakistan">National bank of Pakistan</option>
                                    <option value="NIB Bank Pakistan">NIB Bank Pakistan</option>
                                    <option value="Royal Bank of Scotland Pakistan">Royal Bank of Scotland Pakistan</option>
                                    <option value="Standard Chartered Bank Pakistan">Standard Chartered Bank Pakistan</option>
                                    <option value="Silkbank Limited">Silkbank Limited</option>
                                    <option value="Soneri Bank">Soneri Bank</option>
                                    <option value="Summit Bank">Summit Bank</option>
                                    <option value="Telenor Microfinance/EasyPaisa">Telenor Microfinance/EasyPaisa</option>
                                    <option value="United Bank Limited">United Bank Limited</option> */}
                                </select>
                                <label for="accountNumber">Stripe Key</label>
                                <input type="text" className='form-control' value={accountNumber} onChange={infoChangeHandler} placeholder="Enter Stripe Key here" id="accountNumber" name="accountNumber"/>
                                <br/>
                                {showLoader && 
                                <div style={{ marginLeft:'45%'}}>
                                    <PuffLoader size={100}/>
                                </div>}
                                <button onClick={formInfoSubmitHandler} className="btn btn-dark mt-4 mb-3 form-control " style={{backgroundColor:'rgb(0,0,0,0.8)',width:'30%' }} name='save' id='save'>Save</button>
                            </div>
                        </Tab>
                        <Tab eventKey="addAdmin" title="Add Admin">
                            <div className='row'>
                                <label>Full name</label>
                                <input type="text" className="form-control" name='fullName' placeholder='Full Name' onChange={addAdminChangeHandler}/>
                                <br/>
                                <labe for="email">Email</labe>
                                <input type="email" className="form-control" name='email' placeholder='someting@someprovider.com' onChange={addAdminChangeHandler}/>
                                <br/>
                                <label for="password">First time Password</label>
                                <input type="password" className="form-control" name='password' placeholder='Password' onChange={addAdminChangeHandler}/>
                                <br/>
                                {showLoader && 
                                <div style={{ marginLeft:'45%'}}>
                                    <PuffLoader size={100}/>
                                </div>}
                                <input type="button" className="btn btn-dark mt-4 mb-3 form-control " style={{backgroundColor:'rgb(0,0,0,0.8)',width:'30%' }} value="Add Now" onClick={addAdminSubmitHandler}/>
                            </div>
                        </Tab>
                        <Tab eventKey="addOrganization" title="Organization Detail">
                            <form onSubmit={formik.handleSubmit}>
                                <div className='row' style={{width: '700px'}}>
                                    <label>Aim</label>
                                    <input type="text" value={formik.values.aim} onChange={formik.handleChange} className="form-control" name='aim' placeholder='Aim' />
                                    <br/>
                                    <label for="vision">Vision</label>
                                    <input type="text" value={formik.values.vision} onChange={formik.handleChange} className="form-control" name='vision' placeholder='Vision' />
                                    <br/>
                                    <label for="contact">Contact Us Text</label>
                                    <input type="text" value={formik.values.contactLink} onChange={formik.handleChange} className="form-control" name='contactLink' placeholder='Contact Us Text'/>
                                    <br/>
                                    <label for="contact">Contact Us Link</label>
                                    <input type="text" value={formik.values.contactText} onChange={formik.handleChange} className="form-control" name='contactText' placeholder='Contact Us Link' />
                                    <br/>
                                    <label for="facebook">Facebook</label>
                                    <input type="link" value={formik.values.facebook} onChange={formik.handleChange} className="form-control" name='facebook' placeholder='Facebook' />
                                    <br/>
                                    <label for="facebook">LinkedIn</label>   
                                    <input type="link" value={formik.values.linkedIn} onChange={formik.handleChange} className="form-control" name='linkedin' placeholder='LinkedIn' />
                                    <br/>
                                    <label for="twitter">Twitter</label>
                                    <input type="link" value={formik.values.twitter} onChange={formik.handleChange} className="form-control" name='twitter' placeholder='Twitter' />
                                    <br/>
                                    <br/>
                                    <input type="submit" className="btn btn-dark mt-4 mb-3 form-control " style={{backgroundColor:'rgb(0,0,0,0.8)',width:'30%' }} value="Save" />
                                </div>
                            </form>
                        </Tab>
                    </Tabs>  
                      <hr/> 
                    </div>
                </div>
            </div>
        </div>
    </div>
)
}
export default AdminAccount
