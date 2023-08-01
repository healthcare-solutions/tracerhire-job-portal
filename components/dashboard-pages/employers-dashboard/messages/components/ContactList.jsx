import Image from "next/image";
import SearchBox from "./SearchBox";
import { useRouter } from "next/router";
import { supabase } from "../../../../../config/supabaseClient";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

const ChatboxContactList = () => {

    const user = useSelector(state => state.candidate.user)
    const router = useRouter();
    const [userData, setUserData] = useState([]);

    function removeDuplicateObjects(array, property) {
        const uniqueIds = [];
        const unique = array.filter(element => {
            //console.log("element", element.user_id);
            if (element.user_id != null) {
                const isDuplicate = uniqueIds.includes(element[property]);
                if (!isDuplicate) {
                    uniqueIds.push(element[property]);
                    return true;
                }
                return false;
            }
        });
        return unique;
    }

    const getDistApplicants = async () => {
        // let { data, error } = await supabase.from('applications').select('user_id');
        // let res = await removeDuplicateObjects(data, 'user_id');
        // if(res){
        //     let { data2, error } = await supabase.from('users').select('user_id').contains("user_id", res);
        //     console.log("data2",data2);
        // }
        const fetchUser = await supabase.from('users').select().ilike('role', 'CANDIDATE');
        if (fetchUser) {
            setUserData(fetchUser.data);
        }

    }

    useEffect(() => {
        getDistApplicants();
    }, []);

    return (
        <ul className="contacts">
            {
                userData && userData.map((item,index) => {
                    //console.log('item', item);
                    //let image_url = item.photo_url != null ? item.photo_url : '/images/resource/candidate-1.png';
                    let message_url = '/messages?user='+item.user_id;
                    let image_url = '/images/resource/candidate-1.png';
                    return (<li key={index}>
                        <a href={message_url}>
                            <div className="d-flex bd-highlight">
                                <div className="img_cont">
                                    <Image
                                        src={image_url}
                                        alt="chatbox avatar"
                                        width={90}
                                        height={90}
                                    />
                                </div>
                                <div className="user_info">
                                    <span>{item.name}</span>
                                </div>
                            </div>
                        </a>
                    </li>)
                })
            }
            {/* End single Contact List */}

        </ul>
    );
};

export default ChatboxContactList;
