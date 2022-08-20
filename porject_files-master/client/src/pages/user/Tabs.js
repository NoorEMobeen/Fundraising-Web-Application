import { useState,useEffect } from "react";
import { React } from "react";
import "./../../App.css";
import {useFormik} from 'formik'
import axios from "axios";
import {SERVER_NAME} from '../../components/config/config';
import { auth } from "../../components/firebase/config";
import { ref as refStorage,getDownloadURL,getStorage, uploadBytesResumable,listAll } from 'firebase/storage';
import { ProgressBar } from 'react-bootstrap';
import PuffLoader from "react-spinners/PuffLoader";
import ProfileProgress from "../../components/bars/ProfileProgress";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from "@fortawesome/free-solid-svg-icons";

function Tabs() {
  const [showLoader, setShowLoader] = useState(false);
  const [imageNames, setImagNames] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [imageUploadProgress, setImageUploadProgress] = useState({
    nicPassportFront:0,
    nicPassportBack:0,
    institutionAffiliationDocument:0,
    gradeProofDocument:0,
    paidSchoolFeeReceipt:0,
    incomeDocumentProof:0,
    houseOwnershipRentedProof:0,
    electricityBill01:0,
    electricityBill02:0,
    electricityBill03:0,
    gassBill01:0,
    gassBill02:0,
    gassBill03:0,
    telephoneBill01:0,
    telephoneBill02:0,
    telephoneBill03:0
  });
  const [toggleState, setToggleState] = useState(1);
  const toggleTab = (index) => {
    setToggleState(index);
  };

  const initialValues={
    //toggleState 1
    gender:profileData.gender || 'Male',
    dateOfBirth:profileData.dateOfBirth || '',
    employementStatus:profileData.employementStatus || 'Student',
    //toggleState 2
    instituteName:profileData.instituteName || '',
    currentClass:profileData.currentClass || '',
    recentGrade:profileData.recentGrade || 'A',
    schoolFeePerMonth:profileData.schoolFeePerMonth || '',
    feeConcessions:profileData.feeConcessions || '',
    
    //toggleState 3
    totalFamilyIncome:profileData.totalFamilyIncome || '',
    incomeDocumentProof:profileData.incomeDocumentProof || '',
    guardianName:profileData.guardianName || '',
    cellPhoneGuardian:profileData.cellPhoneGuardian || '',
    houseOwnership:profileData.houseOwnership || '',
    houseOwnershipRentedProof:profileData.houseOwnershipRentedProof || '',

    //toggleState 4
    familyHeadName: profileData.familyHeadName || '',
    familyHeadRelation:profileData.familyHeadRelation || '',
    totalFamilyMembers:profileData.totalFamilyMembers || '',
    employedMembers:profileData.employedMembers || '',
    siblingsStudying:profileData.siblingsStudying || '',
    totalEducationExpenditure:profileData.totalEducationExpenditure || '',
    totalFamilyExpenditure:profileData.totalFamilyExpenditure || '',
    additionalExpenditureTitles:profileData.additionalExpenditureTitles || '',
    additionalExpenditureRupees:profileData.additionalExpenditureRupees || '',
    additionalExpenditureDetail:profileData.additionalExpenditureDetail || '',

    //toggleState 5
    bankName:profileData.bankName || '',
    branchCode:profileData.branchCode || '',
    accountNumber:profileData.accountNumber || '',
    accountOwner:profileData.accountOwner || '',
    associatedContactNumber:profileData.associatedContactNumber || ''    
  }

  useEffect(() => {
    auth.currentUser.getIdToken()
    .then((currentToken)=>{
        const data ={
            headers:{
                authorization:currentToken
            }
        }
        axios.get(SERVER_NAME+'/student/profile',data)
        .then((res)=>{
          setProfileData(res.data);
        }).catch((err)=>console.log(err));
    }).catch((err)=>console.log(err));
    
    //get number of images
    listAll(refStorage(getStorage(), auth.currentUser.uid+'/images'))
    .then((res) => {
      const names = res.items.map(i=>{
        return i.name.split('.')[0];
      });
      setImagNames(names);
    })
    .catch((error) => {
        // Handle any errors
        console.log('Error finding images:'+error.message);
    });
}, []);

  const onSubmit=values=>{
    setShowLoader(true);
    auth.currentUser.getIdToken().then((currentToken)=>{
      axios.post(SERVER_NAME+'/student/create/profile',values,{
        headers:{
          'authorization':currentToken,
          'Content-Type': 'multipart/form-data'
        }
      }).then((res)=>{
        setShowLoader(false);
        if(res.status===200){
          alert('Success!\nData Inserted/Updated successfully.');
        }
      }).catch((err)=>{
        alert("Error Occured while saving your data!");
        setShowLoader(false);
      });
    })
    

    //images={};


    // var user = auth.currentUser;
    // set(ref(realtimeDB, 'profileData/'+ user.uid), {
    //     fullName:fullName,
    //     designation:designation,
    //     address:address,
    //     website:website,
    //     twitter:twitter,
    //     instagram:instagram,
    //     facebook:facebook
    // }).then((res)=>{
    //     alert("Data saved Successfully");
    // }).catch((err)=>{
    //     alert("unknown error occured");
    // });
  
  }

  const validate=values=>{

  }

  const formik=useFormik({
    enableReinitialize:true,
    initialValues,
    onSubmit,
    validate
  });

  const onImageChange=(event)=>{
    var user = auth.currentUser;

    //write file(s) to storage in file or blob format
    const storageRef = refStorage(getStorage(), user.uid+'/images/'+event.target.name+'.jpg');
    const metadata = {
        contentType: 'image/jpeg',
      };          
    // 'file' comes from the Blob or File API
    const uploadTask = uploadBytesResumable(storageRef, event.target.files[0],metadata);
    
    uploadTask.on('state_changed', 
    (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        setImageUploadProgress({...imageUploadProgress,[event.target.name]:(snapshot.bytesTransferred / snapshot.totalBytes) * 100});
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
  // const onImageChange = (event) => {
  //   let n=event.target.name;
  //   let value=event.target.files[0];
  //   images={...images,n:value}

  //   // if (event.target.files && event.target.files[0]) {
  //   //   let reader = new FileReader();
  //   //   reader.onload = (e) => {
  //   //     setImage(e.target.files[0]);
  //   //   };
  //   //   reader.readAsDataURL(event.target.files[0]);
  //   // }

  // }

  return (
    <>
    <h3 class="text-secondary">Fill the information below</h3>
    <h4 class="text-secondary"><b>Note:</b> If you represent an institute, look for hints in <span style={{color:"orange"}}>orange</span> to fill the information</h4>
    <ProfileProgress width="100%"/>
    <div className="container">
      <div className="bloc-tabs">
        <button
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          <b>Personal</b>
        </button>
        <button
          className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(2)}
        >
          <b>Education</b>
        </button>
        <button
          className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(3)}
        >
          <b>Finance</b>
        </button>

        <button
          className={toggleState === 4 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(4)}
        >
          <b>Family</b>
        </button>

        <button
          className={toggleState === 5 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(5)}
        >
          <b>Bank</b>
        </button>
      </div>

      <div className="content-tabs">
        <form onSubmit={formik.handleSubmit}>
          
          <div className={toggleState === 1 ? "content  active-content" : "content"}>
            <div className="form-group">
              <p style={{color:"orange"}}><b>hint:</b><br/> This information is required to be filled by person who will handle this account.</p>
            <label>Gender</label>
            <div>
            <select name="gender" className="form-control" onChange={formik.handleChange}>
                <option selected value="Male">Male</option>
                <option value="Female">Female</option>  
                <option value="Other">Other</option>                        
            </select>
            </div>
            </div>
            <br/>
            <div className="form-group">
            <label>Date of birth</label>
            <input type="date" value={formik.values.dateOfBirth} onChange={formik.handleChange} name="dateOfBirth" className="form-control" placeholder="Select date"/>
            </div>
            <br/>
            <div className="form-group">
            <label>NIC/Passport/Driving License front side {imageNames.indexOf('nicPassportFront')!=-1 && <FontAwesomeIcon style={{height:"20px", width:"20px"}} color="green" icon={faCheck} />}</label>
            <input type="file" name="nicPassportFront" onChange={onImageChange} className="form-control"/>
            <ProgressBar striped variant="info" now={imageUploadProgress.nicPassportFront} style={{height:'4px'}}/>
            </div>
            <br/>
            <div className="form-group">
            <label>NIC/Passport/Driving License back side{imageNames.indexOf('nicPassportBack')!=-1 && <FontAwesomeIcon style={{height:"20px", width:"20px"}} color="green" icon={faCheck} />}</label>
            <input type="file" name="nicPassportBack" onChange={onImageChange} className="form-control"/>
            <ProgressBar striped variant="info" now={imageUploadProgress.nicPassportBack} style={{height:'4px'}}/>
            </div>
            <br/>
            <div className="form-group">
            <label>Status</label>
            <div>
                <select name="employementStatus" className="form-control" onChange={formik.handleChange}>
                    <option selected value="Student">Student</option>
                    <option value="Employed">Employed</option>  
                    <option value="Freelancer">Freelancer/Self Employed</option>  
                    <option value="None">None</option>                        
                </select>
            </div>
            </div>
          </div>

          <div className={toggleState === 2 ? "content  active-content" : "content"}>
            <p style={{color:"orange"}}><b>hints:</b><br/> In case this account represents an institute only fill first two fields<br/>
            If you are creating this account for yourself, fill this information completely
            </p>
          <div className="form-group">
          <label>Institute name</label>
          <input type="text" value={formik.values.instituteName} onChange={formik.handleChange} name="instituteName" className="form-control" placeholder="Enter Institute Name"/>
          </div>
          <div className="form-group">
          <label>School fee per month <span style={{color:"orange"}}>Average fee collection per month in case of institute</span></label>
          <input type="number" value={formik.values.schoolFeePerMonth} onChange={formik.handleChange} name="schoolFeePerMonth" className="form-control" placeholder="Enter school fee"/>
          </div>
          <div className="form-group">
          <label>Current Class/level</label>
          <input type="text" value={formik.values.currentClass} onChange={formik.handleChange} name="currentClass" className="form-control" placeholder="Enter current class/level"/>
          </div>
          <div className="form-group">
          <label>Institution affiliation proof document{imageNames.indexOf('institutionAffiliationDocument')!=-1 && <FontAwesomeIcon style={{height:"20px", width:"20px"}} color="green" icon={faCheck} />}</label>
          <input type="file" onChange={onImageChange} name="institutionAffiliationDocument" className="form-control"/>
          <ProgressBar striped variant="info" now={imageUploadProgress.institutionAffiliationDocument} style={{height:'4px'}}/>
          </div>
          <div className="form-group">
          <label>Recent Grade</label>
          <div>
          <select name="recentGrade" className="form-control" onChange={formik.handleChange}>
              <option selected value="A">A</option>
              <option value="B">B</option>  
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>                        
          </select>
          </div>
          </div>
          <div className="form-group">
          <label>Grade proof document/Result card{imageNames.indexOf('gradeProofDocument')!=-1 && <FontAwesomeIcon style={{height:"20px", width:"20px"}} color="green" icon={faCheck} />}</label>
          <input type="file" onChange={onImageChange} name="gradeProofDocument" className="form-control"/>
          <ProgressBar striped variant="info" now={imageUploadProgress.gradeProofDocument} style={{height:'4px'}}/>
          </div>
          <div className="form-group">
          <label>Fee concessions</label>
          <input type="text" value={formik.values.feeConcessions} onChange={formik.handleChange} name="feeConcessions" className="form-control" placeholder="Enter any concession (if provided)"/>
          </div>
          <div className="form-group">
          <label>Paid school fee receipt (concessions mentioned){imageNames.indexOf('paidSchoolFeeReceipt')!=-1 && <FontAwesomeIcon style={{height:"20px", width:"20px"}} color="green" icon={faCheck} />}</label>
          <input type="file" onChange={onImageChange} name="paidSchoolFeeReceipt" className="form-control"/>
          <ProgressBar striped variant="info" now={imageUploadProgress.paidSchoolFeeReceipt} style={{height:'4px'}}/>
          </div>
          </div>

          <div className={toggleState === 3 ? "content  active-content" : "content"}>
          <p style={{color:"orange"}}><b>hints:</b><br/> Hints in orange color for institute<br/>
          If you are creating this account for yourself, fill this information completely
            </p>
          <div className="form-group">
          <label>Total Family Income <span style={{color:"orange"}}>Total Income</span></label>
          <input type="text" value={formik.values.totalFamilyIncome} onChange={formik.handleChange} name="totalFamilyIncome" className="form-control" placeholder="Enter Income"/>
          </div>
          <br/>
          <div className="form-group">
          <label>Income Proof Document{imageNames.indexOf('incomeDocumentProof')!=-1 && <FontAwesomeIcon style={{height:"20px", width:"20px"}} color="green" icon={faCheck} />}</label>
          <input type="file" onChange={onImageChange} name="incomeDocumentProof" className="form-control" placeholder="Mention Per month Billing amount"/>
          <ProgressBar striped variant="info" now={imageUploadProgress.incomeDocumentProof} style={{height:'4px'}}/>
          </div>
          <br/>
          <div className="form-group">
          <label>Guardian <span style={{color:"orange"}}>Principle/head of institute</span> name</label>
          <input type="text" value={formik.values.guardianName} onChange={formik.handleChange} name="guardianName" className="form-control" placeholder="Name your Guardian"/>
          </div>
          <br/>
          <div className="form-group">
          <label>Cell Phone (Guardian <span style={{color:"orange"}}>Principle/head of institute</span>)</label>
          <input type="text" value={formik.values.cellPhoneGuardian} onChange={formik.handleChange} name="cellPhoneGuardian" className="form-control" placeholder="Enter Phone no"/>
          </div>
          <br/>
          <div className="form-group">
          <label>Ownership Status of House<span style={{color:"orange"}}>Institute land</span></label>
          <select name="houseOwnership" className="form-control" onChange={formik.handleChange}>
              <option selected value="Self Owned">Self Owned</option>
              <option value="On Rent">On Rent</option>  
              <option value="Company Owned">Company Owned</option>
              <option value="No Ownership">No Ownership</option>  
          </select>
          </div>
          <br/>
          <div className="form-group">
          <label>House <span style={{color:"orange"}}>Institute land</span> Ownership/Rented proof Document{imageNames.indexOf('houseOwnershipRentedProof')!=-1 && <FontAwesomeIcon style={{height:"20px", width:"20px"}} color="green" icon={faCheck} />}</label>
          <input type="file" onChange={onImageChange} name="houseOwnershipRentedProof" className="form-control"/>
          <ProgressBar striped variant="info" now={imageUploadProgress.houseOwnershipRentedProof} style={{height:'4px'}}/>
          </div>
          <br/>
          <div className="form-group">
          <label>Last 3 month Electricity bills</label>
          <input type="file" onChange={onImageChange} name="electricityBill01" className="form-control" placeholder="Mention Per month Billing amount"/>{imageNames.indexOf('electricityBill01')!=-1 && <FontAwesomeIcon style={{height:"20px", width:"20px"}} color="green" icon={faCheck} />}
          <ProgressBar striped variant="info" now={imageUploadProgress.electricityBill01} style={{height:'4px'}}/>
          <input type="file" onChange={onImageChange} name="electricityBill02" className="form-control" placeholder="Mention Per month Billing amount"/>{imageNames.indexOf('electricityBill02')!=-1 && <FontAwesomeIcon style={{height:"20px", width:"20px"}} color="green" icon={faCheck} />}
          <ProgressBar striped variant="info" now={imageUploadProgress.electricityBill02} style={{height:'4px'}}/>
          <input type="file" onChange={onImageChange} name="electricityBill03" className="form-control" placeholder="Mention Per month Billing amount"/>{imageNames.indexOf('electricityBill03')!=-1 && <FontAwesomeIcon style={{height:"20px", width:"20px"}} color="green" icon={faCheck} />}
          <ProgressBar striped variant="info" now={imageUploadProgress.electricityBill03} style={{height:'4px'}}/>
          </div>
          <br/>
          <div className="form-group">
          <label>Last 3 month Gas bills <span style={{color:"orange"}}>if any</span></label>
          <input type="file" onChange={onImageChange} name="gassBill01" className="form-control" placeholder="Mention Per month Billing amount"/>{imageNames.indexOf('gassBill01')!=-1 && <FontAwesomeIcon style={{height:"20px", width:"20px"}} color="green" icon={faCheck} />}
          <ProgressBar striped variant="info" now={imageUploadProgress.gassBill01} style={{height:'4px'}}/>
          <input type="file" onChange={onImageChange} name="gassBill02" className="form-control" placeholder="Mention Per month Billing amount"/>{imageNames.indexOf('gassBill02')!=-1 && <FontAwesomeIcon style={{height:"20px", width:"20px"}} color="green" icon={faCheck} />}
          <ProgressBar striped variant="info" now={imageUploadProgress.gassBill02} style={{height:'4px'}}/>
          <input type="file" onChange={onImageChange} name="gassBill03" className="form-control" placeholder="Mention Per month Billing amount"/>{imageNames.indexOf('gassBill03')!=-1 && <FontAwesomeIcon style={{height:"20px", width:"20px"}} color="green" icon={faCheck} />}
          <ProgressBar striped variant="info" now={imageUploadProgress.gassBill03} style={{height:'4px'}}/>
          </div>
          <br/>
          <div className="form-group">
          <label>Last 3 month Telephone bills <span style={{color:"orange"}}>if any</span></label>
          <input type="file" onChange={onImageChange} name="telephoneBill01" className="form-control" placeholder="Mention Per month Billing amount"/>{imageNames.indexOf('telephoneBill01')!=-1 && <FontAwesomeIcon style={{height:"20px", width:"20px"}} color="green" icon={faCheck} />}
          <ProgressBar striped variant="info" now={imageUploadProgress.telephoneBill01} style={{height:'4px'}}/>
          <input type="file" onChange={onImageChange} name="telephoneBill02" className="form-control" placeholder="Mention Per month Billing amount"/>{imageNames.indexOf('telephoneBill02')!=-1 && <FontAwesomeIcon style={{height:"20px", width:"20px"}} color="green" icon={faCheck} />}
          <ProgressBar striped variant="info" now={imageUploadProgress.telephoneBill02} style={{height:'4px'}}/>
          <input type="file" onChange={onImageChange} name="telephoneBill03" className="form-control" placeholder="Mention Per month Billing amount"/>{imageNames.indexOf('telephoneBill03')!=-1 && <FontAwesomeIcon style={{height:"20px", width:"20px"}} color="green" icon={faCheck} />}
          <ProgressBar striped variant="info" now={imageUploadProgress.telephoneBill03} style={{height:'4px'}}/>
          </div>
          </div>

          <div className={toggleState === 4 ? "content  active-content" : "content"}>
          <p style={{color:"orange"}}><b>hint:</b><br/> If you reprsent an Institute, you don't need to fill this information
            </p>
          <div className="form-group">
          <label>Family Head</label>
          <input type="text" value={formik.values.familyHeadName} onChange={formik.handleChange} name="familyHeadName" className="form-control" placeholder="Head of Family Name"/>
          <input type="text" value={formik.values.familyHeadRelation} onChange={formik.handleChange} name="familyHeadRelation" className="form-control" placeholder="Relation"/>
          </div>
          <br/>
          <div className="form-group">
          <label>Total family members</label>
          <input type="number" value={formik.values.totalFamilyMembers} onChange={formik.handleChange} name="totalFamilyMembers" className="form-control" placeholder="Mention total family individuals"/>
          </div>
          <br/>
          <div className="form-group">
          <label>Employed Members</label>
          <input type="number" value={formik.values.employedMembers} onChange={formik.handleChange} name="employedMembers" className="form-control" placeholder="No. of earning family members"/>
          </div>
          <br/>
          <div className="form-group">
          <label>Siblings Studying</label>
          <input type="number" value={formik.values.siblingsStudying} onChange={formik.handleChange} name="siblingsStudying" className="form-control" placeholder="No. of siblings studying"/>
          </div>
          <br/>
          <div className="form-group">
          <label>Total Family Expenditure on Education (per month)</label>
          <input type="number" value={formik.values.totalEducationExpenditure} onChange={formik.handleChange} name="totalEducationExpenditure" className="form-control" placeholder="All studying members of family fees and other study expences"/>
          </div> 
          <br/>
          <div className="form-group">
          <label>Total Family Expenditure (per month)</label>
          <input type="number" value={formik.values.totalFamilyExpenditure} onChange={formik.handleChange} name="totalFamilyExpenditure" className="form-control" placeholder="Sum of  all expences INCLUDING STUDY"/>
          </div> 
          <br/>
          <div className="form-group">
          <label>Any Additional Expenditure (per month)</label>
          <input type="text" value={formik.values.additionalExpenditureTitles} onChange={formik.handleChange} name="additionalExpenditureTitles" className="form-control" placeholder="e.g) Accident, Insurance, investment etc"/>
          <input type="number" value={formik.values.additionalExpenditureRupees} onChange={formik.handleChange} name="additionalExpenditureRupees" className="form-control" placeholder="Rs/-"/>
          </div>  
          <br/>
          <div className="form-group">
          <label>Detail of expenses (per month)</label>
          <textarea className="form-control" onChange={formik.handleChange} value={formik.values.additionalExpenditureDetail} name="additionalExpenditureDetail" placeholder="Type here"/>
          </div>      
          </div>

          <div className={toggleState === 5 ? "content  active-content" : "content"}>
          <p style={{color:"orange"}}>fill this information</p>
          <div className="form-group">
          <label>Associated Bank Account<span style={{color:'red'}}>(Only valid accounts will be allowed)</span></label>
          <br/>
          <select className="form-control" name="bankName" onChange={formik.handleChange}>
            <option value="Stripe Account">Stripe Account</option>
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
          {/* <input type="text" value={formik.values.branchCode} onChange={formik.handleChange} name="branchCode" className="form-control" placeholder="Branch Code (if applicable)"/> */}
          </div>
          <br/>
          <div className="form-group">
          <label>Key</label>
          <input type="text" value={formik.values.accountNumber} onChange={formik.handleChange} name="accountNumber" className="form-control" placeholder="Stripe Account Key"/>
          {/* <input type="text" value={formik.values.accountOwner} onChange={formik.handleChange} name="accountOwner" className="form-control" placeholder="Account Title/Owner"/> */}
          </div>
          <br/>
          <div className="form-group">
          <label>Associated Contact Number</label>
          <input type="text" value={formik.values.associatedContactNumber} onChange={formik.handleChange} name="associatedContactNumber" className="form-control" placeholder="Mention linked contact no"/>
          </div>
          </div>

          <input type="submit" className="btn btn-dark" style={{backgroundColor:'rgb(0,0,0,0.8)', marginTop:'20px'}} value="Save"/>
          {showLoader?<PuffLoader size={50}/>:''}
          <br/><br/>
        </form>
      </div>
    </div>
    </>
  );
}

export default Tabs;
