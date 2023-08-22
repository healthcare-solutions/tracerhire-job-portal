import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from "../../../../../config/supabaseClient";
import { useSelector } from "react-redux";
import moment from 'moment';
import { BallTriangle } from 'react-loader-spinner'

// validation chaching
function checkFileTypes(files) {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    for (let i = 0; i < files.length; i++) {
        if (!allowedTypes.includes(files[i].type)) {
            return false;
        }
    }
    return true;
}

const CvUploader = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [getManager, setManager] = useState([]);
    const [getError, setError] = useState("");
    const [userCV, setUserCV] = useState([]);
    const [totalCV, setTotalCV] = useState(0);
    const user = useSelector(state => state.candidate.user);
    const [cloudPath, setCloudPath] = useState("https://ntvvfviunslmhxwiavbe.supabase.co/storage/v1/object/public/applications/cv/");

    const cvManagerHandler = (event) => {
        const data = Array.from(event.target.files);
        const isExist = getManager?.some((file1) =>
            data.some((file2) => file1.name === file2.name)
        );
        if (!isExist) {
            if (checkFileTypes(data)) {
                handleFileLogoChange(event);
                setManager(getManager.concat(data));
                setError("");
            } else {
                setError("Only accept  (.doc, .docx, .pdf) file");
            }
        } else {
            setError("File already exists");
        }
    };

    const getUserCV = async () => {
        setIsLoading(true);
        let { data, error } = await supabase
            .from('candidate_resumes')
            .select("*")
            .eq('type', 'CV Uploaded')
            .eq('deleted', 'no')
            .eq('user_id', user.id)
            .order('id', { ascending: false });
        if (data) {
            setTotalCV(data.length);
            setUserCV(data);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        ///handleSetDefaultCV();
        setTimeout(() => {
            getUserCV();
        }, 2000);
    }, []);

    const handleSetDefaultCV = async () => {
        const fetchCV = await supabase
            .from('candidate_resumes')
            .select()
            .eq('user_id', user.id)
            .eq('type', 'CV Uploaded')
            .eq('deleted', 'no')
            .order('id', { ascending: false });
        if (fetchCV.data[0] && fetchCV.data[0] !== undefined) {
            let updateDefaultCVToNull = await supabase
                .from('candidate_resumes')
                .update({ sub_title: "" })
                .eq('user_id', user.id);
            if (updateDefaultCVToNull) {
                await supabase
                    .from('candidate_resumes')
                    .update({ sub_title: 'defaultcv' })
                    .eq('id', fetchCV.data[0].id);
            }
        }
    }

    const handleFileLogoChange = async (event) => {
        let selectedFile = event.target.files[0];
        if (selectedFile) {

            toast.success('Please wait while CV is uploading.......', {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

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



                let insertNotification = await supabase
                    .from('candidate_resumes')
                    .insert([
                        {
                            type: `CV Uploaded`,
                            user_id: user.id,
                            title: "CV " + moment(new Date()).format("MM/DD/YYYY HH:mm:ss"),
                            attachemnt: fileTimestamp + '-' + selectedFile.name,
                            created_at: new Date(),
                            modified_at: new Date()
                        }
                    ]);

                if (insertNotification) {

                    setTimeout(() => {
                        //location.reload();
                        getUserCV();
                    }, 2000);
                    toast.success('CV Successfully Uploaded!', {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                }
            } handleSetDefaultCV();
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

    // delete image
    const deleteHandler = async (id) => {
        if (confirm("Are you sure want to delete this CV?")) {
            setIsLoading(true);
            //const deleted = getManager?.filter((file) => file.name !== name);
            //setManager(deleted);
            await supabase.from('candidate_resumes').update({ deleted: 'yes' }).eq('id', id);
            toast.success('CV Successfully Deleted!', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            handleSetDefaultCV();
            setTimeout(() => {
                getUserCV();
            }, 2000);
        } else {
            return false;
        }

    };

    const viewHandler = async (filename) => {
        window.open(cloudPath + filename, '_blank', 'noreferrer');
    }

    const DownloadHandler = (fileName) => {
        fetch(cloudPath + fileName, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/pdf',
          },
        })
          .then(response => response.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
          });
      };

    return (
        <>
            {/* Start Upload resule */}
            <div className="uploading-resume">
                <div className="uploadButton">
                    <input
                        className="uploadButton-input"
                        type="file"
                        name="attachments[]"
                        accept=".doc,.docx,.xml,application/msword,application/pdf, image/*"
                        id="upload"
                        multiple
                        onChange={cvManagerHandler}
                    />
                    <label className="cv-uploadButton" htmlFor="upload">
                        <span className="title">Drop files here to upload</span>
                        <span className="text">
                            To upload file size is (Max 5Mb) and allowed file
                            types are (.doc, .docx, .pdf)
                        </span>
                        <span className="theme-btn btn-style-one">
                            Upload Resume
                        </span>
                        {getError !== "" ? (
                            <p className="ui-danger mb-0">{getError}</p>
                        ) : undefined}
                    </label>
                    <span className="uploadButton-file-name"></span>
                </div>
            </div>
            {/* End upload-resume */}

            {/* Start resume Preview  */}
            <div className="files-outer">
                {
                    isLoading &&
                    <div style={{ width: '20%', margin: "auto" }}>
                        <BallTriangle
                            height={100}
                            width={100}
                            radius={5}
                            color="#000"
                            ariaLabel="ball-triangle-loading"
                            wrapperClass={{}}
                            wrapperStyle=""
                            visible={true}
                        />
                    </div>
                }
                {isLoading == false && userCV?.map((file, i) => (
                    <div key={i} className="file-edit-box">
                        <span className="title">{file.title}</span>
                        <span className="title">{file.sub_title}</span>
                        <div className="edit-btns">
                            <button onClick={() => viewHandler(file.attachemnt)}>
                                <span className="la la-eye"></span>
                            </button>
                            <button onClick={() => DownloadHandler(file.attachemnt)}>
                                <span className="la la-download"></span>
                            </button>
                            {
                                totalCV > 1 && <button onClick={() => deleteHandler(file.id)}>
                                    <span className="la la-trash"></span>
                                </button>
                            }
                        </div>
                    </div>
                ))}

                {/* {getManager?.map((file, i) => (
                    <div key={i} className="file-edit-box">
                        <span className="title">{file.name}</span>
                        <div className="edit-btns">
                            <button>
                                <span className="la la-pencil"></span>
                            </button>
                            <button onClick={() => deleteHandler(file.name)}>
                                <span className="la la-trash"></span>
                            </button>
                        </div>
                    </div>
                ))} */}

                {/* <div className="file-edit-box">
                    <span className="title">Sample CV</span>
                    <div className="edit-btns">
                        <button>
                            <span className="la la-pencil"></span>
                        </button>
                        <button>
                            <span className="la la-trash"></span>
                        </button>
                    </div>
                </div>

                <div className="file-edit-box">
                    <span className="title">Sample CV</span>
                    <div className="edit-btns">
                        <button>
                            <span className="la la-pencil"></span>
                        </button>
                        <button>
                            <span className="la la-trash"></span>
                        </button>
                    </div>
                </div>*/}
            </div>
            {/* End resume Preview  */}
        </>
    );
};

export default CvUploader;
