import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { setUserData } from "../features/candidate/candidateSlice";
const logout = (dispatch) => {
    dispatch(setUserData({ name: "", id: "", email: "", role: "" }))
    localStorage.clear()

    // open toast
    toast.success('Successfully Logout!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });

    // useRouter().push("/")
}

export { logout };