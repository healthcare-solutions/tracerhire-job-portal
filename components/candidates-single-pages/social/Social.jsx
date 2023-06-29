const Social = (props) => {

  const socialContent = [
    { id: 1, icon: "fa-facebook-f", link: props.fb? props.fb : "https://www.facebook.com/" },
    { id: 2, icon: "fa-twitter", link: props.tw? props.tw : "https://www.twitter.com/" },
    { id: 3, icon: "fa-instagram", link: props.in? props.in : "https://www.instagram.com/" },
    { id: 4, icon: "fa-linkedin-in", link: props.li? props.li : "https://www.linkedin.com/" },
  ];


  
  return (
    <div className="social-links">
      {socialContent.map((item) => (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          key={item.id}
        >
          <i className={`fab ${item.icon}`}></i>
        </a>
      ))}
    </div>
  );
};

export default Social;
