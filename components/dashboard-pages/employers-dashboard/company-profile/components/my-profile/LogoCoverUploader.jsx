import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from "../../../../../../config/supabaseClient";
import { useSelector } from "react-redux";

const LogoCoverUploader = () => {
    const user = useSelector(state => state.candidate.user);
    const [cloudPath, setCloudPath] = useState("https://ntvvfviunslmhxwiavbe.supabase.co/storage/v1/object/public/applications/cv/");
    const [customer, setCustomer] = useState(null);
    const [logoFilename, setLogoFilename] = useState(null);
    const [coverFilename, setCoverFilename] = useState(null);

    const [logoFile, setLogoFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);

    useEffect(() => {
        fetchCustomer(user.id);
    }, []);

    const fetchCustomer = async (userID) => {
        try {
            if (userID) {
                let { data: customer, error } = await supabase
                    .from('cust_dtl')
                    .select("*")
                    .eq('cust_id', userID)

                if (customer) {
                    setCustomer(customer[0]);
                    console.log(customer[0]);
                    if (customer[0].profile_logo != null && customer[0].profile_logo.length > 5) {
                        setLogoFile(customer[0].profile_logo);
                    }
                    setLogoFilename(cloudPath + encodeURIComponent(customer[0].profile_logo));
                    if (customer[0].profile_cover != null && customer[0].profile_cover.length > 5) {
                        setCoverFile(customer[0].profile_cover);
                    }
                    setCoverFilename(cloudPath + encodeURIComponent(customer[0].profile_cover));
                }
            }
        } catch (e) {
            toast.error('System is unavailable to fetch logo.  Please try again later or contact tech support!', {
                position: "bottom-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            console.warn(e)
        }
    };

    const handleFileLogoChange = async (event) => {
        let selectedFile = event.target.files[0];
        if (selectedFile) {
            let file;
            let fileTimestamp = Date.now()

            // upload document to applications/cv folder
            const { data: fileUploadSuccess, error: fileUploadError } = await supabase
                .storage
                .from('applications')
                .upload('cv/' + fileTimestamp + '-' + selectedFile.name, selectedFile, file);
            if (fileUploadError) {
                if (fileUploadError.error == "Payload too large") {
                    toast.error('Failed to upload attachment.  Attachment size exceeded maximum allowed size!', {
                        position: "bottom-right",
                        autoClose: false,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                } else {
                    toast.error('System is unavailable.  Please try again later or contact tech support!', {
                        position: "bottom-right",
                        autoClose: false,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                }
            } else {
                // get document downloadable url
                const { data: docURL, error: docURLError } = supabase
                    .storage
                    .from('applications')
                    .getPublicUrl('cv/' + fileTimestamp + '-' + selectedFile.name)
                if (docURLError) {
                    console.warn('Failed to get download URL for file')
                }

                // save applied application
                const { data, error } = await supabase
                    .from('cust_dtl')
                    .select('cust_id,cust_dtl_id')
                    .eq('cust_id', user.id);
                if (data.length > 0) {
                    const dateFormat = () => {
                        const date = new Date()
                        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + date.getFullYear()
                    }
                    const { dataUpdate, error } = await supabase
                        .from('cust_dtl')
                        .update({
                            profile_logo: fileTimestamp + '-' + selectedFile.name,
                            modified_at: dateFormat()
                        })
                        .eq('cust_dtl_id', data[0].cust_dtl_id);
                    
                    const { dataUpdateUser, errorUser } = await supabase
                    .from('users')
                    .update({
                        user_photo: fileTimestamp + '-' + selectedFile.name
                    })
                    .eq('user_id', user.id);
                    //console.log("dataUpdateUser",dataUpdateUser);
                    //console.log("errorUser",errorUser);

                    setLogoFilename(cloudPath + fileTimestamp + '-' + selectedFile.name);
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                }
            }
        }
        else {
            toast.error('Please upload your CV before Apply.', {
                position: "bottom-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }

    const handleFileCoverChange = async (event) => {
        let selectedFile = event.target.files[0];
        if (selectedFile) {
            let file;
            let fileTimestamp = Date.now()

            // upload document to applications/cv folder
            const { data: fileUploadSuccess, error: fileUploadError } = await supabase
                .storage
                .from('applications')
                .upload('cv/' + fileTimestamp + '-' + selectedFile.name, selectedFile, file);
            if (fileUploadError) {
                if (fileUploadError.error == "Payload too large") {
                    toast.error('Failed to upload attachment.  Attachment size exceeded maximum allowed size!', {
                        position: "bottom-right",
                        autoClose: false,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                } else {
                    toast.error('System is unavailable.  Please try again later or contact tech support!', {
                        position: "bottom-right",
                        autoClose: false,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                }
            } else {
                // get document downloadable url
                const { data: docURL, error: docURLError } = supabase
                    .storage
                    .from('applications')
                    .getPublicUrl('cv/' + fileTimestamp + '-' + selectedFile.name)
                if (docURLError) {
                    console.warn('Failed to get download URL for file')
                }

                // save applied application
                const { data, error } = await supabase
                    .from('cust_dtl')
                    .select('cust_id,cust_dtl_id')
                    .eq('cust_id', user.id);
                if (data.length > 0) {
                    const dateFormat = () => {
                        const date = new Date()
                        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + date.getFullYear()
                    }
                    const { dataUpdate, error } = await supabase
                        .from('cust_dtl')
                        .update({
                            profile_cover: fileTimestamp + '-' + selectedFile.name,
                            modified_at: dateFormat()
                        })
                        .eq('cust_dtl_id', data[0].cust_dtl_id);
                        setCoverFilename(cloudPath + fileTimestamp + '-' + selectedFile.name);
                }
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        }
        else {
            toast.error('Please upload your CV before Apply.', {
                position: "bottom-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }

    const handleDeleteCoverPhoto = async () => {
        if(confirm("Are you sure you wish to delete photo?")){
            // const { data, error } = await supabase
            // .from('users')
            // .update({
            //     user_photo: ""
            // })
            // .eq('user_id', user.id);
            await supabase
            .from('cust_dtl')
            .update({
                profile_cover: "",
                modified_at: new Date()
            })
            .eq('cust_id', user.id);
            
            toast.success('Cover Photo deleted successfully.', {
                position: "bottom-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    }

    const handleDeletePhoto = async () => {
        if(confirm("Are you sure you wish to delete photo?")){
            const { data, error } = await supabase
            .from('users')
            .update({
                user_photo: ""
            })
            .eq('user_id', user.id);
            await supabase
            .from('cust_dtl')
            .update({
                profile_logo: "",
                modified_at: new Date()
            })
            .eq('cust_id', user.id);
            
            toast.success('Logo deleted successfully.', {
                position: "bottom-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    }

    return (
        <>
            <div className="uploading-outer">
                <div className="uploadButton" style={{backgroundRepeat:'no-repeat',backgroundImage:"url("+logoFilename+")",backgroundSize:'50% auto',backgroundPosition:'center'}}>
                    <input
                        className="uploadButton-input"
                        type="file"
                        name="attachments[]"
                        accept="image/*"
                        id="upload"
                        required
                        onChange={handleFileLogoChange}
                    />
                    <label
                        className="uploadButton-button ripple-effect"
                        htmlFor="upload"
                    >
                        {"Browse Logo"}
                    </label>
                    <span className="uploadButton-file-name"></span>
                </div>
                <div className="text">
                    Max file size is 1MB, Minimum dimension: 330x300 And
                    Suitable files are .jpg & .png
                    {
                        logoFile && logoFile != "" && <div onClick={() => handleDeletePhoto()} style={{color:'#FF0000',cursor:'pointer'}}>Delete</div>
                    }
                </div>
            </div>

            <div className="uploading-outer">
                <div className="uploadButton" style={{backgroundRepeat:'no-repeat',backgroundImage:"url("+coverFilename+")",backgroundSize:'50% auto',backgroundPosition:'center'}}>
                    <input
                        className="uploadButton-input"
                        type="file"
                        name="attachments[]"
                        accept="image/*, application/pdf"
                        id="upload_cover"
                        //onChange={(e) => coverHandler(e.target.files[0])}
                        onChange={handleFileCoverChange}
                        
                    />
                    <label
                        className="uploadButton-button ripple-effect"
                        htmlFor="upload_cover"
                    >
                        {"Browse Cover"}
                    </label>
                    <span className="uploadButton-file-name"></span>
                </div>
                <div className="text">
                    Max file size is 1MB, Minimum dimension: 330x300 And
                    Suitable files are .jpg & .png
                    {
                        coverFile && coverFile != "" && <div onClick={() => handleDeleteCoverPhoto()} style={{color:'#FF0000',cursor:'pointer'}}>Delete</div>
                    }
                    {/* {
                        coverFilename && coverFilename != "" && <img src={coverFilename} style={{ width: 100 }} />
                    } */}
                </div>
            </div>
        </>
    );
};
export default LogoCoverUploader;