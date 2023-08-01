import Social from "../social/Social";

const CompanyInfo = ({ company }) => {
  return (
    <ul className="company-info">
      <li>
        Company size: <span>{company.employee_size}</span>
      </li>
      <li>
        Founded in: <span>{company.company_since}</span>
      </li>
      <li>
        Location:{" "}
        <span>
          {company.city}, {company.st_cd}
        </span>
      </li>
      {
        company.facebook_url != null || company.linkedin_url != null && <li>
        Social media:
        <Social company={company} />
      </li>
      }
      
    </ul>
  );
};

export default CompanyInfo;
