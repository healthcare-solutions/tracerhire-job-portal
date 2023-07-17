const Social = ({ company }) => {
  console.log("social company", company.linkedin_url);
  const ValidateURL = (str) => {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(str)) {
      return "https://" + str;
    } else {
      return str;
    }
  }
  const socialContent = [
    { id: 1, icon: "fa-facebook-f", link: company.facebook_url != null ? company.facebook_url : "" },
    { id: 2, icon: "fa-twitter", link: company.twitter_url != null ? company.twitter_url : "" },
    { id: 3, icon: "fa-instagram", link: company.instagram_url != null ? company.instagram_url : "" },
    { id: 4, icon: "fa-linkedin-in", link: company.linkedin_url != null ? company.linkedin_url : "" },
  ];
  return (
    <div className="social-links">
      {socialContent.map((item, index) => {
        if (item.link != "") {
          return (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              key={item.id}
            >
              <i className={`fab ${item.icon}`}></i>
            </a>
          )
        }
      })}
    </div>
  );
};

export default Social;
