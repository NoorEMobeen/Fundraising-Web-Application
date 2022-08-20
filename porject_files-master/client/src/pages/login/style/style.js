import SignupBGImage from './bg2.JPG';
import LoginBGImage from './bg3.jpg';

const classes={
    signupBackgroundImage : {
        backgroundImage: `url(${SignupBGImage})`,
        backgroundRepeat:'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width:'100%',
        height:window.screen.availHeight || '800px'
    },
    loginBackgroundImage : {
        backgroundImage: `url(${LoginBGImage})`,
        backgroundRepeat:'no-repeat',
        backgroundSize:'cover',
        backgroundPosition: 'center',
        width:'100%',
        height:window.screen.availHeight || '800px'
    },
    signupCard:{
        marginTop:"5%", 
        marginBottom:"10%x", 
        borderRadius:"20px",
        backgroundColor:'rgba(0,0,0,0.8)',
        height:'80%'
    },
    loginCard:{
        borderRadius:"20px",
        backgroundColor:'rgba(0,0,0,0.7)',
        width:'100%'
    }
}
export default classes;