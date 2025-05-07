import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsSearch, BsBriefcaseFill} from 'react-icons/bs'
import {IoLocationOutline} from 'react-icons/io5'
import {FaRegStar} from 'react-icons/fa'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobItems: [],
    searchInput: '',
    selectedEmploymentTypes: [],
    selectedSalaryRange: '',
    noJobsFound: false,
    isLoading: false,
    hasProfileError: false,
    hasProductError: false,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getSearchResults()
  }

  getProfileDetails = async () => {
    this.setState({isLoading: true, hasProfileError: false})
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken === undefined) {
      return
    }
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({profileDetails: updatedData, isLoading: false})
    } else {
      this.setState({isLoading: false, hasProfileError: true})
    }
  }

  onChangeSearchText = event => {
    this.setState({searchInput: event.target.value})
  }

  getSearchResults = async () => {
    this.setState({isLoading: true, noJobsFound: false, hasProductError: false})
    const {
      searchInput,
      selectedEmploymentTypes,
      selectedSalaryRange,
    } = this.state
    const employmentFilter = selectedEmploymentTypes.join(',')
    const salaryFilter = selectedSalaryRange
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentFilter}&minimum_package=${salaryFilter}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const resultList = data.jobs.map(jobDetail => ({
        companyLogoUrl: jobDetail.company_logo_url,
        employmentType: jobDetail.employment_type,
        id: jobDetail.id,
        jobDescription: jobDetail.job_description,
        location: jobDetail.location,
        packagePerAnnum: jobDetail.package_per_annum,
        rating: jobDetail.rating,
        title: jobDetail.title,
      }))
      this.setState({
        jobItems: resultList,
        isLoading: false,
        noJobsFound: resultList.length === 0,
      })
    } else {
      this.setState({isLoading: false, hasProductError: true})
    }
  }

  onChangeEmploymentType = event => {
    const {id, checked} = event.target
    this.setState(
      prevState => ({
        selectedEmploymentTypes: checked
          ? [...prevState.selectedEmploymentTypes, id]
          : prevState.selectedEmploymentTypes.filter(type => type !== id),
      }),
      this.getSearchResults,
    )
  }

  onChangeSalaryRange = event => {
    this.setState({selectedSalaryRange: event.target.id}, this.getSearchResults)
  }

  render() {
    const {
      profileDetails,
      jobItems,
      searchInput,
      isLoading,
      noJobsFound,
      hasProfileError,
      hasProductError,
    } = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <>
        <Header />
        <div className="jobs-page">
          <div className="profile-and-options-container">
            {isLoading && (
              <div className="loader-container" data-testid="loader">
                <Loader
                  type="ThreeDots"
                  color="#ffffff"
                  height="50"
                  width="50"
                />
              </div>
            )}
            {!isLoading && !hasProfileError && (
              <div className="profile-container">
                <img
                  src={profileImageUrl}
                  alt="profile"
                  className="profile-icon"
                />
                <h1 className="profile-name">{name}</h1>
                <p className="profile-bio">{shortBio}</p>
              </div>
            )}
            {!isLoading && hasProfileError && (
              <div className="error-msg-container">
                <button
                  className="retry-btn"
                  type="button"
                  onClick={() => {
                    this.getProfileDetails()
                    this.getSearchResults()
                  }}
                >
                  Retry
                </button>
              </div>
            )}
            <hr className="options-seperator" />
            <h1 className="employment-heading">Type of Employment</h1>
            <div className="employment-filters-container">
              <ul className="employment-type-container">
                {employmentTypesList.map(item => (
                  <li key={item.employmentTypeId}>
                    <input
                      type="checkbox"
                      id={item.employmentTypeId}
                      onChange={this.onChangeEmploymentType}
                    />
                    <label
                      htmlFor={item.employmentTypeId}
                      className="employment-list-item"
                    >
                      {item.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr className="options-seperator" />
            <h1 className="salary-range-heading">Salary Range</h1>
            <ul className="salary-filters-container">
              {salaryRangesList.map(item => (
                <li key={item.salaryRangeId}>
                  <input
                    type="radio"
                    name="salary"
                    id={item.salaryRangeId}
                    onChange={this.onChangeSalaryRange}
                  />
                  <label
                    htmlFor={item.salaryRangeId}
                    className="salary-range-text"
                  >
                    {item.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="search-and-info-container">
            <div className="search-container">
              <input
                type="search"
                placeholder="Search"
                className="search-input"
                value={searchInput}
                onChange={this.onChangeSearchText}
              />
              <button
                type="button"
                className="search-btn"
                data-testid="searchButton"
                onClick={this.getSearchResults}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {noJobsFound && (
              <div className="no-jobs-container">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                  alt="no jobs"
                  className="no-jobs-img"
                />
                <h1 className="no-jobs-text">No Jobs Found</h1>
                <p className="no-jobs-info">
                  We could not find any jobs. Try other filters.
                </p>
              </div>
            )}
            {!isLoading && !hasProductError && (
              <ul className="search-results-container">
                {jobItems.map(item => (
                  <li key={item.id} className="job-item-container">
                    <Link to={`/jobs/${item.id}`} className="job-item-link">
                      <div className="company-logo-and-title-container">
                        <img
                          src={item.companyLogoUrl}
                          alt="company logo"
                          className="company-logo"
                        />
                        <div className="company-title-rating-container">
                          <h1 className="company-title">{item.title}</h1>
                          <p className="company-rating">
                            <FaRegStar className="star-icon" />
                            {item.rating}
                          </p>
                        </div>
                      </div>
                      <div className="company-details-container">
                        <div className="location-employment-container">
                          <IoLocationOutline className="location-icon" />
                          <p className="location-text">{item.location}</p>
                          <BsBriefcaseFill className="employment-icon" />
                          <p className="employment-type-text">
                            {item.employmentType}
                          </p>
                        </div>
                        <p className="job-item-package">
                          {item.packagePerAnnum}
                        </p>
                      </div>
                      <hr className="seperator" />
                      <h1 className="description-heading">Description</h1>
                      <p className="job-description">{item.jobDescription}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {!isLoading && hasProductError && (
              <div className="search-results-container">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
                  alt="failure view"
                  className="product-error-img"
                />
                <h1 className="error-text">Oops! Something Went Wrong</h1>
                <p className="error-info">
                  We cannot seem to find the page you are looking for.
                </p>
                <button
                  className="retry-btn"
                  type="button"
                  onClick={this.getSearchResults}
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
