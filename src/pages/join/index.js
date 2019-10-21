import React from 'react'
import Layout from '../../components/Layout'
import PageTitle from "../../components/PageTitle";
import InputText from "../../components/InputText";
import Form from "../../components/Form";
import FieldsetMulti from "../../components/FieldsetMulti";
import InputDate from "../../components/InputDate";

// function encode(data) {
//   return Object.keys(data)
//     .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
//     .join('&')
// }

export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      validationIssues: []
    }
  }

  submitHandler = () => {

  }

  updateValidationIssues = ({id, message}) => {
    const validationIssues = this.state.validationIssues
    for (let i = 0; i < validationIssues.length; i++) {
      if (validationIssues[i].id === id) {
        if (!message) {
          validationIssues.splice(i, 1)
          return
        }

        validationIssues[i].message = message
        this.setState({
          validationIssues: validationIssues,
        })
        return
      }
    }

    validationIssues.push({
      id: id,
      message: message,
    })
    this.setState({
      validationIssues: validationIssues,
    })
  }

  render() {
    return (
      <Layout>
        <section className="section">
          <div className="container">
            <div className="content">
              <PageTitle title={"Join us"} />
              <Form action={"/join/thanks"} backValue={"Back"} formId={"join"}
                    method={"POST"} nextValue={"Next"}
                    submitHandler={this.submitHandler} submitValue={"Submit"}
                    validationIssues={this.state.validationIssues}>
                <FieldsetMulti legend={"What is your name?"} validationIssues={this.state.validationIssues}>
                  <InputText label={"First name"} inputId={"firstName"}
                             inputType={"text"} inputAttributes={{
                    required: true,
                  }} validationMessages={{
                    valueMissing: "Enter your first name",
                  }} setFormValidationState={this.updateValidationIssues} />
                  <InputText label={"Last name"} inputId={"lastName"}
                             inputType={"text"} inputAttributes={{
                    required: true,
                  }} validationMessages={{
                    valueMissing: "Enter your last name",
                  }} setFormValidationState={this.updateValidationIssues} />
                </FieldsetMulti>
                <FieldsetMulti legend={"What is your date of birth?"} validationIssues={this.state.validationIssues}>
                  <InputDate hint={"Membership is only open to people aged 18 or over"} inputAttributes={{
                    required: true,
                  }} inputId={"dateOfBirth"} setFormValidationState={this.updateValidationIssues} />
                </FieldsetMulti>
              </Form>
            </div>
          </div>
        </section>
      </Layout>
    )
  }
}
