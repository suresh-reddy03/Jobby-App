import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaRegStar} from 'react-icons/fa'
import {IoLocationOutline} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'
import Header from '../Header'
import './index.css'

class JobItemDetails extends Component {
  state = {jobData: null, isLoading: false, hasError: false}

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({hasError: false, isLoading: true})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')

    if (!jwtToken) {
      this.setState({isLoading: false})
      return
    }

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok) {
        const updatedData = {
          jobDetails: {
            companyLogoUrl: data.job_details.company_logo_url,
            companyWebsiteUrl: data.job_details.company_website_url,
            employmentType: data.job_details.employment_type,
            id: data.job_details.id,
            jobDescription: data.job_details.job_description,
            skills: data.job_details.skills.map(skill => ({
              imageUrl: skill.image_url,
              name: skill.name,
            })),
            lifeAtCompany: {
              description: data.job_details.life_at_company.description,
              imageUrl: data.job_details.life_at_company.image_url,
            },
            location: data.job_details.location,
            packagePerAnnum: data.job_details.package_per_annum,
            rating: data.job_details.rating,
            title: data.job_details.title,
          },
          similarJobs: data.similar_jobs.map(job => ({
            companyLogoUrl: job.company_logo_url,
            employmentType: job.employment_type,
            id: job.id,
            jobDescription: job.job_description,
            location: job.location,
            rating: job.rating,
            title: job.title,
          })),
        }
        this.setState({jobData: updatedData, isLoading: false})
      } else {
        this.setState({isLoading: false, hasError: true})
      }
    } catch (error) {
      this.setState({isLoading: false, hasError: true})
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (!jwtToken) {
      return <Redirect to="/login" />
    }

    const {jobData, isLoading, hasError} = this.state

    if (isLoading) {
      return (
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }

    if (hasError) {
      return (
        <div className="error-view">
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
            className="failure-img"
          />
          <h1 className="failure-error">Oops! Something Went Wrong</h1>
          <p className="failure-info">
            We cannot seem to find the page you are looking for
          </p>
          <button
            type="button"
            onClick={this.getJobItemDetails}
            className="retry-btn"
          >
            Retry
          </button>
        </div>
      )
    }

    if (!jobData) return null

    const {jobDetails, similarJobs} = jobData

    return (
      <>
        <Header />
        <div className="job-item-details-page">
          <div className="job-item-details-page-container">
            <div className="company-logo-and-title-container">
              <img
                src={jobDetails.companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
              <div className="company-title-rating-container">
                <h1 className="company-title">{jobDetails.title}</h1>
                <p className="company-rating">
                  <FaRegStar className="star-icon" />
                  {jobDetails.rating}
                </p>
              </div>
            </div>
            <div className="company-details-container">
              <div className="location-employment-container">
                <IoLocationOutline className="location-icon" />
                <p className="location-text">{jobDetails.location}</p>
                <BsBriefcaseFill className="employment-icon" />
                <p className="employment-type-text">
                  {jobDetails.employmentType}
                </p>
              </div>
              <p className="job-item-package">{jobDetails.packagePerAnnum}</p>
            </div>
            <hr className="job-item-details-seperator" />
            <div className="description-and-link-container">
              <h1 className="description-heading">Description</h1>
              <a
                href={jobDetails.companyWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                className="company-website-link"
              >
                Visit <FiExternalLink className="link-icon" />
              </a>
            </div>
            <p className="job-description">{jobDetails.jobDescription}</p>
            <h1 className="skills-heading">Skills</h1>
            <ul className="skills-container">
              {jobDetails.skills.map(skill => (
                <li className="skill-item" key={skill.name}>
                  <img
                    src={skill.imageUrl}
                    alt={skill.name}
                    className="skill-icon"
                  />
                  <p className="skill-name">{skill.name}</p>
                </li>
              ))}
            </ul>
            <h1 className="life-at-company-heading">Life at Company</h1>
            <div className="company-description-and-img-container">
              <p className="company-description">
                {jobDetails.lifeAtCompany.description}
              </p>
              <img
                src={jobDetails.lifeAtCompany.imageUrl}
                alt="life at company"
                className="company-img"
              />
            </div>
          </div>
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs-container">
            {similarJobs.map(job => (
              <li className="similar-job-item" key={job.id}>
                <div className="company-logo-and-title-container">
                  <img
                    src={job.companyLogoUrl}
                    alt="similar job company logo"
                    className="company-logo"
                  />
                  <div className="company-title-rating-container">
                    <h1 className="company-title">{job.title}</h1>
                    <p className="company-rating">
                      <FaRegStar className="star-icon" />
                      {job.rating}
                    </p>
                  </div>
                </div>
                <h1 className="description-heading">Description</h1>
                <p className="job-description">{job.jobDescription}</p>
                <div className="location-employment-container">
                  <IoLocationOutline className="location-icon" />
                  <p className="location-text">{job.location}</p>
                  <BsBriefcaseFill className="employment-icon" />
                  <p className="employment-type-text">{job.employmentType}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }
}

export default JobItemDetails
