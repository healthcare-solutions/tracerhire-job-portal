const JobSkills = (props) => {
  console.log("props",props.data);
  let skills = [
    "app",
    "administrative",
    "android",
    "wordpress",
    "design",
    "react",
  ];
  if(props.data && props.data !== undefined){
    let all_skills = props.data;
    skills = all_skills.split(",");
  }
  
  return (
    <ul className="job-skills">
      {skills.map((skill, i) => (
        <li key={i}>
          <a href="#">{skill}</a>
        </li>
      ))}
    </ul>
  );
};

export default JobSkills;
