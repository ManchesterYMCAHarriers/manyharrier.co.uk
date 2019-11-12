import React from 'react'
import Layout from '../../components/Layout'
import StandardContentContainer from '../../components/StandardContentContainer'
import Form from '../../components/Form'
import FieldsetMulti from '../../components/FieldsetMulti'
import {graphql, StaticQuery} from 'gatsby'
import FieldsetText from '../../components/FieldsetText'
import Encode from '../../components/Encode'
import FieldsetSelect from "../../components/FieldsetSelect";
import FieldsetTextarea from "../../components/FieldsetTextarea";
import {PanelFullWidth, Panels} from "../../components/Panels";

export default class CheckoutIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      externalError: null,
      formAction: '/contact',
      submitValue: 'Next',
      stage: 1,
      stages: 5,
      validationIssues: [],
    }
  }

  submitFormData = async () => {
    return await fetch(this.state.formAction, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      }),
      body: Encode(this.state.data),
    })
  }

  backHandler = ev => {
    ev.preventDefault()
    this.setState({
      stage: this.state.stage - 1,
      submitValue: 'Next',
    })
  }

  submitHandler = ev => {
    ev.preventDefault()
    // Check if visible elements validate
    let data = this.state.data
    ev.target
      .querySelector('fieldset:not(.hidden)')
      .querySelectorAll('input, textarea, select')
      .forEach(input => {
        if (input.checkValidity()) {
          if (input.tagName.toLowerCase() === 'input') {
            if (
              input.getAttribute('type').toLowerCase() === 'radio' ||
              input.getAttribute('type').toLowerCase() === 'checkbox'
            ) {
              if (input.checked) {
                data[input.getAttribute('name')] = input.value
              }
            } else {
              data[input.getAttribute('name')] = input.value
            }
          } else if (input.tagName.toLowerCase() === 'textarea') {
            data[input.getAttribute('name')] = input.value
          } else if (input.tagName.toLowerCase() === 'select') {
            data[input.getAttribute('name')] =
              input.options[input.selectedIndex].value
          }
        }
      })

    // If validation fails, don't continue
    if (this.state.validationIssues.length > 0) {
      return
    }

    let nextStage = this.state.stage + 1

    this.setState(
      {
        data: data,
      },
      () => {
        if (this.state.stage < this.state.stages) {
          this.setState(
            {
              stage: nextStage,
              submitValue: this.state.stage === this.state.stages - 1 ? "Submit" : "Next",
            },
            () => {
              // Scroll to page title
              document.querySelector('h1').scrollIntoView()
              // Set focus on first visible input
              const firstVisibleInput = ev.target
                .querySelector('fieldset:not(.hidden)')
                .querySelector('input:not([type="hidden"]), textarea, select')
              if (firstVisibleInput) {
                firstVisibleInput.focus({
                  preventScroll: true,
                })
              }
            }
          )
        }
        // ...or submit
        else if (this.state.stage === this.state.stages) {
          data['form-name'] = ev.target.getAttribute('name')
          this.setState(
            {
              data: data,
            },
            async () => {
              try {
                const {status, ok} = await this.submitFormData()

                if (!ok) {
                  console.error('Submit form data error', status)
                  this.setState({
                    externalError: true,
                  })
                  return
                }

                this.setState({
                  externalError: false,
                  stage: nextStage,
                  submitValue: "Back to Home",
                })
              } catch (err) {
                console.error('Submit form data network error', err)
                this.setState({
                  externalError: true,
                })
              }
            }
          )
        } else {
          window.location.href = "/"
        }
      }
    )
  }

  updateValidationIssues = ({id, message}) => {
    const validationIssues = this.state.validationIssues
    // Update/remove existing validation issues
    for (let i = 0; i < validationIssues.length; i++) {
      if (validationIssues[i].id === id) {
        if (!message) {
          validationIssues.splice(i, 1)
          this.setState(
            {
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

    // Add new validation issue
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

  render() {
    return (
      <StaticQuery
        query={graphql`
          query Contact {
            site {
              siteMetadata {
                title
              }
            }
          }
        `}
        render={({site: data}) => {
          return (
            <Layout path={'/contact'}>
              <StandardContentContainer>
                <h1 className="heading-1">Contact us</h1>
                <Panels>
                  <PanelFullWidth>
                    <div className="panel red-bottom">
                      <Form
                        backHandler={this.backHandler}
                        backValue={'Back'}
                        externalError={this.state.externalError}
                        formId={'contact'}
                        method={'POST'}
                        netlify={true}
                        showBack={this.state.stage > 1 && this.state.stage <= this.state.stages}
                        showSubmit={true}
                        submitHandler={this.submitHandler}
                        submitValue={this.state.submitValue}
                      >
                        {/* Name */}
                        <FieldsetText inputId={"name"} inputType={"text"}
                                      label={"What is your name?"}
                                      setFormValidationState={this.updateValidationIssues}
                                      validationIssues={this.state.validationIssues}
                                      visible={this.state.stage === 1}
                                      validationMessages={{
                                        valueMissing: "Enter your name"
                                      }}
                                      inputAttributes={{
                                        autoComplete: "name",
                                        required: true,
                                      }}
                        />

                        {/* Email */}
                        <FieldsetText
                          inputId={'email'}
                          inputType={'email'}
                          label={'What is your email address?'}
                          setFormValidationState={this.updateValidationIssues}
                          validationIssues={this.state.validationIssues}
                          visible={this.state.stage === 2}
                          inputAttributes={{
                            autoComplete: 'email',
                            required: true,
                          }}
                          validationMessages={{
                            typeMismatch: 'Enter a valid email address',
                            valueMissing: 'Enter your email address',
                          }}
                        />

                        {/* Filtering */}
                        <FieldsetSelect
                          defaultValue={''}
                          legend={'What are you contacting us about?'}
                          inputId={'reason'}
                          inputAttributes={{
                            required: true,
                          }}
                          setFormValidationState={this.updateValidationIssues}
                          visible={this.state.stage === 3}
                          validationIssues={this.state.validationIssues}
                          validationMessages={{
                            valueMissing: 'Select an option',
                          }}
                        >
                          <option value="">
                            (Select a reason)
                          </option>
                          <option value="I'm interested in joining the club">
                            I'm interested in joining the club
                          </option>
                          <option value="I am promoting an event">
                            I am promoting an event
                          </option>
                          <option value="Something else">
                            Something else
                          </option>
                        </FieldsetSelect>

                        {/* Message */}
                        <FieldsetTextarea inputId={"message"}
                                          label={"What is your message"}
                                          setFormValidationState={this.updateValidationIssues}
                                          validationIssues={this.state.validationIssues}
                                          visible={this.state.stage === 4}
                                          rows={5}
                                          validationMessages={{
                                            valueMissing: "Enter your message"
                                          }}
                                          inputAttributes={{
                                            required: true,
                                          }}
                        />

                        {/* Review */}
                        <FieldsetMulti
                          legend={'Is everything correct?'}
                          hint={
                            'If not, please use the back button to go back and change it.'
                          }
                          validationIssues={this.state.validationIssues}
                          visible={this.state.stage === 5}
                        >
                          <dl>
                            <dt>Name</dt>
                            <dd>
                              {this.state.data.name}
                            </dd>
                            <dt>Email address</dt>
                            <dd>{this.state.data.email}</dd>
                            <dt>Reason for getting in touch</dt>
                            <dd>{this.state.data.reason}</dd>
                            <dt>Your message</dt>
                            <dd className="whitespace-pre-line">
                              {this.state.data.message}
                            </dd>
                          </dl>
                        </FieldsetMulti>

                        {/* Thanks */}
                        <FieldsetMulti
                          legend={'Thanks for getting in touch!'}
                          setFormValidationState={this.updateValidationIssues}
                          validationIssues={this.state.validationIssues}
                          visible={this.state.stage === 6}
                        >
                          <p>We've received your message.</p>
                        </FieldsetMulti>
                      </Form>
                    </div>
                  </PanelFullWidth>
                </Panels>
              </StandardContentContainer>
            </Layout>
          )
        }}
      />
    )
  }
}
