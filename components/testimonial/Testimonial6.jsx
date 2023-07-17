import Slider from "react-slick";
import { supabase } from "../../config/supabaseClient";
import { useEffect, useState } from "react";

const Testimonial4 = () => {

  const [arrData, setArrData] = useState([]);
  const [cloudPath, setCloudPath] = useState("https://ntvvfviunslmhxwiavbe.supabase.co/storage/v1/object/public/applications/cv/");

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    let fetchAllRecords = await supabase
      .from('testimonials')
      .select()
      .eq('status', 'Approved');
    setArrData(fetchAllRecords.data);
  }


  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: true,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <>
      {
        arrData.length > 0 &&
        <div>
          <div className="text-center mb-5">
            <h2 className="fw-700">What people are saying</h2>
          </div>

          <Slider {...settings} arrows={false}>
            {arrData.map((item, index) => {
              let photo_url = '/images/resource/candidate-1.png';
              if (item.user_photo != null) {
                photo_url = cloudPath + item.user_photo;
              }
              return (
                <div className="testimonial -type-1" key={item.id}>
                  <div className="thumb">
                    <img src={photo_url} alt="testimonial" style={{width:64,height:64}} />
                  </div>
                  {/* End .thumb */}
                  <div className="content">
                    <h4>{item.testimonial_text}</h4>
                  </div>
                  {/* End .content */}
                  <div className="author">
                    <h4 className="name">{item.user_name}</h4>
                  </div>
                </div>
              )
            })}
          </Slider>
        </div>
      }
    </>
  );
};

export default Testimonial4;
