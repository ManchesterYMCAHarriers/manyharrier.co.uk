import React from 'react'
import Layout from '../../components/Layout'
import PageTitle from "../../components/PageTitle";
import InputText from "../../components/InputText";
import Form from "../../components/Form";
import FieldsetMulti from "../../components/FieldsetMulti";
import InputDate from "../../components/InputDate";
import Moment from 'moment'
import FieldsetRadios from "../../components/FieldsetRadios";
import FieldsetText from "../../components/FieldsetText";
import FieldsetTextarea from "../../components/FieldsetTextarea";
import FieldsetCheckbox from "../../components/FieldsetCheckbox";

// function encode(data) {
//   return Object.keys(data)
//     .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
//     .join('&')
// }

export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      stage: 1,
      stages: 14,
      submitValue: "Next",
      validationIssues: []
    }
  }

  backHandler = () => {
    if (this.state.stage > 1) {
      let prevStage = this.state.stage - 1
      // Exceptions
      const data = this.state.data
      if (this.state.stage === 6 && data.membership === "First claim") {
        prevStage -= 1
      } else if (this.state.stage === 12 && !data.telephone) {
        prevStage -= 1
      }

      this.setState({
        stage: prevStage,
        submitValue: "Next",
      })
    }
  }

  submitHandler = ev => {
    ev.preventDefault()
    // Check if visible elements validate
    let data = this.state.data
    ev.target.querySelector('fieldset:not(.is-hidden)').querySelectorAll('input, textarea, select').forEach(input => {
      if (input.checkValidity()) {
        if (input.tagName.toLowerCase() === "input") {
          if (input.getAttribute("type").toLowerCase() === "radio" || input.getAttribute("type").toLowerCase() === "checkbox") {
            if (input.checked) {
              data[input.getAttribute("name")] = input.value
            }
          } else {
            data[input.getAttribute("name")] = input.value
          }
        } else if (input.tagName.toLowerCase() === "textarea") {
          data[input.getAttribute("name")] = input.value
        } else if (input.tagName.toLowerCase() === "select") {
          data[input.getAttribute("name")] = input.options[input.selectedIndex].value
        }
      }
    })

    // If validation fails, don't continue
    if (this.state.validationIssues.length > 0) {
      return
    }

    this.setState({
      data: data,
    }, () => {
      // Navigate to the next page in the form...
      let nextStage = this.state.stage + 1
      // Exceptions
      if (this.state.stage === 4 && data.membership === "First claim") {
        nextStage += 1
      } else if (this.state.stage === 10 && !data.telephone) {
        nextStage += 1
      }

      if (this.state.stage < this.state.stages) {
        this.setState({
          stage: nextStage,
          submitValue: this.state.stage === this.state.stages - 1 ? "Submit" : "Next"
        }, () => {
          // Scroll to page title
          document.querySelector("h1").scrollIntoView()
          // Set focus on first visible input
          const firstVisibleInput = ev.target.querySelector('fieldset:not(.is-hidden)').querySelector('input:not([type="hidden"]), textarea, select')
          console.log(firstVisibleInput)
          if (firstVisibleInput) {
            firstVisibleInput.focus({
              preventScroll: true,
            })
          }
        })
      }
      // ...or submit it
      else {

      }
    })
  }

  updateValidationIssues = ({id, message}) => {
    const validationIssues = this.state.validationIssues
    for (let i = 0; i < validationIssues.length; i++) {
      if (validationIssues[i].id === id) {
        if (!message) {
          validationIssues.splice(i, 1)
          this.setState({
            validationIssues: validationIssues,
          })
          return
        }

        validationIssues[i].message = message
        this.setState({
          validationIssues: validationIssues,
        })
        return
      }
    }

    if (message) {
      validationIssues.push({
        id: id,
        message: message,
      })
    }

    this.setState({
      validationIssues: validationIssues,
    })
  }

  componentDidMount() {
    document.querySelector('form#join').querySelector('fieldset:not(.is-hidden)').querySelector(' input:not([type="hidden"]), textarea, select').focus({
      preventScroll: true,
    })

  }

  render() {
    return (
      <Layout>
        <section className="section">
          <div className="container">
            <div className="content">
              <PageTitle title={"Join us"} />
              <Form action={"/join/thanks"} formId={"join"}
                    method={"POST"}
                    backHandler={this.backHandler} backValue={"Back"}
                    stage={this.state.stage} stages={this.state.stages}
                    submitHandler={this.submitHandler}
                    submitValue={this.state.submitValue}
                    validationIssues={this.state.validationIssues}>


                {/* First and last name */}
                <FieldsetMulti legend={"What is your name?"}
                               validationIssues={this.state.validationIssues}
                               visible={this.state.stage === 1}>
                  <InputText label={"First name"} inputId={"firstName"}
                             inputType={"text"} inputAttributes={{
                    required: true,
                    autoComplete: "given-name",
                  }} validationMessages={{
                    valueMissing: "Enter your first name",
                  }} setFormValidationState={this.updateValidationIssues} />
                  <InputText label={"Last name"} inputId={"lastName"}
                             inputType={"text"} inputAttributes={{
                    required: true,
                    autoComplete: "family-name",
                  }} validationMessages={{
                    valueMissing: "Enter your last name",
                  }} setFormValidationState={this.updateValidationIssues} />
                </FieldsetMulti>


                {/* Date of birth */}
                <FieldsetMulti legend={"What is your date of birth?"}
                               validationIssues={this.state.validationIssues}
                               visible={this.state.stage === 2}>
                  <InputDate hint={"For example, 28 11 1990"} inputAttributes={{
                    required: true,
                  }} inputId={"dateOfBirth"}
                             setFormValidationState={this.updateValidationIssues}
                             validationMessages={{
                               valueMissing: "Enter your date of birth",
                               dayValueMissing: "Enter your date of birth and include a day, a month and a year",
                               monthValueMissing: "Enter your date of birth and include a day, a month and a year",
                               yearValueMissing: "Enter your date of birth and include a day, a month and a year",
                               invalidDate: "Enter a real date of birth",
                               beforeEarliestDate: "Come on... you can't be that old!",
                               afterLatestDate: "You must be 18 years old or over to join us",
                             }} latestDate={Moment.utc().subtract(18, 'years')}
                             earliestDate={Moment.utc().subtract(120, 'years')}
                             autoCompleteDay={"bday-day"}
                             autoCompleteMonth={"bday-month"}
                             autoCompleteYear={"bday-year"}
                  />
                </FieldsetMulti>


                {/* Gender */}
                <FieldsetRadios inputAttributes={{
                  required: true,
                }} legend={"What is your gender?"} name={"gender"} options={[
                  {
                    id: "genderFemale",
                    label: "Female",
                    value: "Female",
                  },
                  {
                    id: "genderMale",
                    label: "Male",
                    value: "Male",
                  }
                ]} setFormValidationState={this.updateValidationIssues}
                                validationMessages={{
                                  valueMissing: "Select your gender",
                                }}
                                validationIssues={this.state.validationIssues}
                                visible={this.state.stage === 3} />


                {/* Membership type */}
                <FieldsetRadios inputAttributes={{
                  required: true,
                }}
                                hint={"For most people, first claim membership is the correct option. Second claim membership is only available if you are already a member of another UK Athletics affiliated club."}
                                legend={"What type of membership do you need?"}
                                name={"membership"} options={[
                  {
                    id: "membershipFirstClaim",
                    label: "First claim",
                    value: "First claim",
                  },
                  {
                    id: "membershipSecondClaim",
                    label: "Second claim",
                    value: "Second claim",
                  }
                ]} setFormValidationState={this.updateValidationIssues}
                                validationMessages={{
                                  valueMissing: "Select a membership option",
                                }}
                                validationIssues={this.state.validationIssues}
                                visible={this.state.stage === 4} />


                {/* First claim club - conditional */}
                <FieldsetText inputId={"firstClaimClub"} inputType={"text"}
                              inputAttributes={{
                                required: this.state.data.membership === "Second claim",
                              }}
                              label={"What is the name of your first claim club?"}
                              setFormValidationState={this.updateValidationIssues}
                              validationIssues={this.state.validationIssues}
                              validationMessages={{
                                valueMissing: "Enter the name of your first claim club"
                              }}
                              visible={this.state.stage === 5} />


                {/* Y Club membership type */}
                <FieldsetRadios inputAttributes={{
                  required: true,
                }}
                                legend={"Are you a member of the Y Club gym?"}
                                name={"yClubMembership"} options={[
                  {
                    id: "yClubMembershipFull",
                    label: "I have full membership of the Y Club gym",
                    value: "Full member",
                  },
                  {
                    id: "yClubMembershipOffPeak",
                    label: "I have off-peak membership of the Y Club gym",
                    value: "Off-peak member",
                  },
                  {
                    id: "yClubMembershipStudent",
                    label: "I have student membership of the Y Club gym",
                    value: "Student member",
                  },
                  {
                    id: "yClubMembershipSocial",
                    label: "I have social membership of the Y Club gym",
                    value: "Social member",
                  },
                  {
                    id: "yClubMembershipNone",
                    label: "I am not a member of the Y Club gym",
                    value: "Non-member",
                  }
                ]} setFormValidationState={this.updateValidationIssues}
                                validationMessages={{
                                  valueMissing: "Select a Y Club gym membership option",
                                }}
                                validationIssues={this.state.validationIssues}
                                visible={this.state.stage === 6} />


                {/* Address */}
                <FieldsetTextarea inputId={"address"}
                                  label={"What is your address?"} rows={6}
                                  setFormValidationState={this.updateValidationIssues}
                                  validationIssues={this.state.validationIssues}
                                  visible={this.state.stage === 7}
                                  inputAttributes={{
                                    required: true,
                                    autoComplete: "street-address",
                                  }}
                                  validationMessages={{
                                    valueMissing: "Enter your address",
                                  }}
                />


                {/* Email address */}
                <FieldsetText inputId={"email"} inputType={"email"}
                              label={"What is your email address?"}
                              hint={"We will contact you via email with important club information"}
                              setFormValidationState={this.updateValidationIssues}
                              validationIssues={this.state.validationIssues}
                              visible={this.state.stage === 8}
                              inputAttributes={{
                                autoComplete: "email",
                                required: true,
                              }}
                              validationMessages={{
                                typeMismatch: "Enter a valid email address",
                                valueMissing: "Enter your email address"
                              }}
                />


                {/* Newsletter subscription */}
                <FieldsetRadios inputAttributes={{
                  required: true,
                }}
                                hint={"Our newsletter email is sent periodically to keep you up to date with what is going on at the club."}
                                legend={"Do you want to subscribe to our newsletter?"}
                                name={"newsletter"} options={[
                  {
                    id: "newsletterYes",
                    label: "Yes, sign me up for the newsletter",
                    value: "Yes",
                  },
                  {
                    id: "newsletterNo",
                    label: "No, I don't want to receive the newsletter",
                    value: "No",
                  }
                ]} setFormValidationState={this.updateValidationIssues}
                                validationMessages={{
                                  valueMissing: "Select an option",
                                }}
                                validationIssues={this.state.validationIssues}
                                visible={this.state.stage === 9} />


                {/* Telephone number */}
                <FieldsetText inputId={"telephone"} inputType={"tel"}
                              hint={"You do not have to tell us your telephone number if you don't want to"}
                              label={"What is your telephone number?"}
                              setFormValidationState={this.updateValidationIssues}
                              validationIssues={this.state.validationIssues}
                              visible={this.state.stage === 10}
                              inputAttributes={{
                                autoComplete: "tel",
                              }}
                />

                {/* WhatsApp */}
                <FieldsetRadios inputAttributes={{
                  required: true,
                }}
                                hint={"Our WhatsApp group is a place for announcements and informal chat between members."}
                                legend={"Do you want to join our WhatsApp group?"}
                                name={"whatsApp"} options={[
                  {
                    id: "whatsAppYes",
                    label: "Yes, add me to the WhatsApp group",
                    value: "Yes",
                  },
                  {
                    id: "whatsAppNo",
                    label: "No, I don't want to join the WhatsApp group",
                    value: "No",
                  }
                ]} setFormValidationState={this.updateValidationIssues}
                                validationMessages={{
                                  valueMissing: "Select an option",
                                }}
                                validationIssues={this.state.validationIssues}
                                visible={this.state.stage === 11} />


                {/* Emergency contact */}
                <FieldsetMulti
                  legend={"Do you have someone we should contact in the case of an emergency?"}
                  validationIssues={this.state.validationIssues}
                  visible={this.state.stage === 12}
                  hint={"You do not need to tell us an emergency contact if you don't want to."}>
                  <InputText inputId={"emergencyContactName"} inputType={"text"}
                             setFormValidationState={this.updateValidationIssues}
                             label={"What is the name of your emergency contact?"}
                  />
                  <InputText inputId={"emergencyContactNumber"}
                             inputType={"tel"}
                             setFormValidationState={this.updateValidationIssues}
                             label={"What is your emergency contact's telephone number?"} />
                </FieldsetMulti>

                {/* Final declarations */}
                <FieldsetCheckbox inputAttributes={{
                  required: true,
                }} inputId={"declarations"}
                                  legend={"Do you agree to the following statements?"}
                                  validationIssues={this.state.validationIssues}
                                  validationMessages={{
                                    valueMissing: "You must agree to these statements in order to continue"
                                  }}
                                  visible={this.state.stage === 13}
                                  setFormValidationState={this.updateValidationIssues}
                                  label={"Yes, I agree to the statements above"}
                                  statements={
                                    <ul>
                                      <li>I declare that I am an amateur under
                                        the rules of UK Athletics.
                                      </li>
                                      <li>I hereby apply for membership of the
                                        Manchester YMCA Harriers Club and I
                                        agree to abide by the rules of the
                                        Club.
                                      </li>
                                      {this.state.data.yClubMembership === "Non-member" &&
                                      <li>I understand that as I am not a member
                                        of the Y Club, I will not be able to use
                                        any of the Y Club's facilities,
                                        including the changing rooms, lockers,
                                        showers and toilets. I understand that I
                                        cannot leave anything with the Y Club
                                        reception for safe-keeping and should
                                        not
                                        ask to do so.</li>
                                      }
                                      <li>I understand that my personal data
                                        will
                                        be controlled by the Manchester YMCA
                                        Harriers Club and that my personal data
                                        can be processed by any member of the
                                        Club's Committee for official Club
                                        business.
                                      </li>
                                      <li>I understand that on becoming a member
                                        of the Manchester YMCA Harriers Club I
                                        will automatically be registered as a
                                        member of England Athletics. The Club
                                        will provide England Athletics with your
                                        personal data which they will use to
                                        enable access to an online portal for
                                        you (called <em>myAthletics</em>).
                                        England Athletics will contact you to
                                        invite you to sign into
                                        the <em>myAthletics</em> portal, where
                                        you can, amongst other things, set and
                                        amend your privacy settings. If you have
                                        any questions about the continuing
                                        privacy of your personal data when it is
                                        shared with England Athletics, please
                                        contact <a
                                          href="mailto:dataprotection@englandathletics.org">dataprotetion@englandathletics.org</a>.
                                      </li>
                                    </ul>
                                  } />
                {/* Review */}
                <FieldsetMulti legend={"Is all of your information correct?"}
                               hint={"If not, please use the back button to go back and correct it."}
                               validationIssues={this.state.validationIssues}
                               visible={this.state.stage === 14}>
                  <dl>
                    <dt>Name</dt>
                    <dd>{this.state.data.firstName} {this.state.data.lastName}</dd>
                    <dt>Date of birth</dt>
                    <dd>{this.state.data["dateOfBirth-day"]}/{this.state.data["dateOfBirth-month"]}/{this.state.data["dateOfBirth-year"]}</dd>
                    <dt>Gender</dt>
                    <dd>{this.state.data.gender}</dd>
                    <dt>Manchester YMCA Harriers Club membership type</dt>
                    <dd>{this.state.data.membership}</dd>
                    {this.state.data.membership === "Second claim" &&
                    <dt>First claim club</dt>
                    }
                    {this.state.data.membership === "Second claim" &&
                    <dd>{this.state.data.firstClaimClub}</dd>
                    }
                    <dt>Y Club membershipt type</dt>
                    <dd>{this.state.data.yClubMembership}</dd>
                    <dt>Address</dt>
                    <dd>{this.state.data.address}</dd>
                    <dt>Email address</dt>
                    <dd>{this.state.data.email}</dd>
                    <dt>Newsletter subscription</dt>
                    <dd>You have
                      opted{this.state.data.newsletter === "No" && " not"} to
                      receive our email newsletter
                    </dd>
                    <dt>Telephone number</dt>
                    <dd>{this.state.data.telephone}</dd>
                    <dt>WhatsApp group</dt>
                    <dd>You have
                      opted{this.state.data.whatsApp === "No" && " not"} to join
                      our WhatsApp group
                    </dd>
                    <dt>Emergency contact</dt>
                    <dd>{this.state.data.emergencyContactName ? this.state.data.emergencyContactName + " - " + this.state.data.emergencyContactNumber : "No emergency contact details provided"}</dd>
                    <dt>Acceptance of rules and Data Protection statements</dt>
                    <dd>You have accepted the rules and Data Protection
                      statements
                    </dd>
                  </dl>
                </FieldsetMulti>
                {/* Payment */}
              </Form>
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}
