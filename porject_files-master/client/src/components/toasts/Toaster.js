import { toast } from "react-toastify";

const Toaster=(type,text)=>{
    switch (type) {
        case 'success':
            toast.success(text,{
                position: toast.POSITION.BOTTOM_LEFT,
                autoClose:4000,
                hideProgressBar:true,
                closeOnClick:true,

            })
            break;
        case 'info':
            toast.info(text,{
                position: toast.POSITION.BOTTOM_LEFT,
                autoClose:4000,
                hideProgressBar:true,
                closeOnClick:true,
                
            })
            break;
        case 'danger':
            toast.error(text,{
                position: toast.POSITION.BOTTOM_LEFT,
                autoClose:4000,
                hideProgressBar:true,
                closeOnClick:true,
                
            })
            break;
        case 'warning':
            toast.warning(text,{
                position: toast.POSITION.BOTTOM_LEFT,
                autoClose:4000,
                hideProgressBar:true,
                closeOnClick:true,
                
            })
            break;
        default:
            break;
    }
}

export default Toaster;