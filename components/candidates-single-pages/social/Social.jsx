const Social = (props) => {

  const socialContent = [
    { id: 1, icon: "fa-facebook-f", link: props.fb? props.fb : "" },
    { id: 2, icon: "fa-twitter", link: props.tw? props.tw : "" },
    { id: 3, icon: "fa-instagram", link: props.in? props.in : "" },
    { id: 4, icon: "fa-linkedin-in", link: props.li? props.li : "" },
  ];
  
  return (
    <div className="social-links">
      {socialContent.map((item) => (
        item.link && 
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
