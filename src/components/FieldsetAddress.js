import React from 'react'
import PropTypes from 'prop-types'
import InputText from "./InputText";
import ValidationSummary from "./ValidationSummary";

class FieldsetAddress extends React.Component {
  constructor(props) {
    super(props);

    const {getAddressApiKey} = this.props

    this.state = {
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      town: null,
      county: null,
      postcode: null,
      addressApiError: false,
      addressSelected: false,
      addressSelectorOptions: [],
      addressSelectorMapped: [],
      addressSelectorValidationMessage: null,
      postcodeValidationMessage: null,
      validationMessage: null,
      getAddressApiKey: getAddressApiKey,
      latitude: "",
      longitude: "",
    }
  }

  formatPostcode = postcode => {
    const noSpaces = postcode.toUpperCase().replace(/[^A-Z0-9]/g, "")
    return noSpaces.substring(0, noSpaces.length - 3) + " " + noSpaces.substring(noSpaces.length - 3)
  }

  getPossibleAddresses = async () => {
    const {inputId} = this.props

    if (!document.getElementById(inputId + "-postcode").checkValidity()) {
      return
    }

    const postcodeForQuery = this.state.postcode.toLowerCase().replace(/\s/g, "")

    // This data will come from getAddress API
    try {
      const response = await fetch("https://api.getAddress.io/find/" + postcodeForQuery + "?api-key=" + this.state.getAddressApiKey + "&sort=true")

      // Invalid postcode format or postcode not found
      if (response.status === 400 || response.status === 404) {
        this.setState({
          postcodeValidationMessage: "Enter a valid UK postcode"
        }, () => {
          this.setAddressValidationState({
            id: inputId + "-postcode",
            message: this.state.postcodeValidationMessage
          })
        })
        return
      }

      // Other error - 401 = api key not valid, 429 = too many requests, 500 = internal server error
      // Effectively API is down
      if (!response.ok) {
        this.setState({
          addressApiError: true,
        })
        return
      }

      const { latitude, longitude, addresses} = await response.json()

      const optionsArray = addresses.map(option => {
        return option.split(",").map(line => line.trim())
      })

      this.setState({
        addressSelectorOptions: optionsArray.map(option => option.filter(line => line !== "").join(", ")),
        addressSelectorMapped: optionsArray.map(option => {
          return {
            line1: option[0],
            line2: option[1],
            line3: option[2],
            line4: option[3],
            locality: option[4],
            town: option[5],
            county: option[6],
          }
        }),
        latitude: latitude,
        longitude: longitude,
      })
    } catch (err) {
      // Network or other error
      this.setState({
        addressApiError: true,
      })
    }
  }

  componentDidMount() {
    // Validate postcode
    const {inputId} = this.props

    const postcode = document.getElementById(inputId + "-postcode")
    const addressSelector = document.getElementById(inputId + "-address-selector")
    const getAddresses = document.getElementById(inputId + "-get-addresses")

    const postcodeValidationMessages = {
      valueMissing: "Enter your postcode",
      patternMismatch: "Enter a valid UK postcode",
    }

    postcode.addEventListener('invalid', () => {
      const failureStates = [
        'valueMissing',
        'patternMismatch',
      ]

      for (let i = 0; i < failureStates.length; i++) {
        const failureState = failureStates[i]
        if (postcode.validity[failureState] && postcodeValidationMessages[failureState]) {
          this.setState({
            postcodeValidationMessage: postcodeValidationMessages[failureState],
          })
          this.setAddressValidationState({
            id: inputId + "-postcode",
            message: postcodeValidationMessages[failureState],
          })
          break
        }
      }
    }, false)

    postcode.addEventListener('change', () => {
      if (this.formatPostcode(postcode.value) === this.state.postcode) {
        return
      }

      this.setState({
        addressSelected: false,
        addressSelectorOptions: [],
        postcode: this.formatPostcode(postcode.value),
      })

      if (postcode.checkValidity()) {
        this.setState({
          postcodeValidationMessage: null,
        })
        this.setAddressValidationState({
          id: inputId + "-postcode",
        })
      }
    }, false)

    postcode.addEventListener('keydown', ev => {
      if (ev.key === "Enter") {
        ev.preventDefault()
        this.setState({
          addressSelected: false,
          addressSelectorOptions: [],
          postcode: this.formatPostcode(postcode.value),
        }, () => {
          if (postcode.checkValidity()) {
            this.setState({
              postcodeValidationMessage: null,
            }, () => {
              this.getPossibleAddresses()
            })
            this.setAddressValidationState({
              id: inputId + "-postcode",
            })
          }
        })
      }
    }, false)

    addressSelector.addEventListener('invalid', () => {
      const message = "Select your address from the list"

      // Don't error if there's been an issue with the API
      if (!this.state.addressApiError) {
        this.setState({
          addressSelectorValidationMessage: message,
        })
        this.setAddressValidationState({
          id: inputId + "-address-selector",
          message: message,
        })
      }
    }, false)

    addressSelector.addEventListener('change', () => {
      // No address selected
      if (addressSelector.value === "") {
        // Depopulate default field values
        this.setState({
          addressSelected: false,
          addressLine1: null,
          addressLine2: null,
          addressLine3: null,
          town: null,
          county: null,
        }, () => {
          // Let them know it's not cool
          addressSelector.checkValidity()
          // Trigger change event of address fields
          document.getElementById(inputId + "-line-1").dispatchEvent(new Event('change'))
          document.getElementById(inputId + "-line-2").dispatchEvent(new Event('change'))
          document.getElementById(inputId + "-line-3").dispatchEvent(new Event('change'))
          document.getElementById(inputId + "-town").dispatchEvent(new Event('change'))
          document.getElementById(inputId + "-county").dispatchEvent(new Event('change'))
        })
        return
      }

      // Should always be OK with positive selection
      if (addressSelector.checkValidity()) {
        const selection = parseInt(addressSelector.value, 10)
        const address = this.state.addressSelectorMapped[selection]
        // Populate default field values and reset message
        this.setState({
          addressSelectorValidationMessage: null,
          addressSelected: true,
          addressLine1: address.line1,
          addressLine2: address.line2 !== "" ? address.line2 : address.locality,
          addressLine3: address.line2 !== "" && address.locality !== "" ? address.locality : address.line3,
          town: address.town,
          county: address.county,
        }, () => {
          // Trigger change event of address fields
          document.getElementById(inputId + "-line-1").dispatchEvent(new Event('change'))
          document.getElementById(inputId + "-line-2").dispatchEvent(new Event('change'))
          document.getElementById(inputId + "-line-3").dispatchEvent(new Event('change'))
          document.getElementById(inputId + "-town").dispatchEvent(new Event('change'))
          document.getElementById(inputId + "-county").dispatchEvent(new Event('change'))
        })
        this.setAddressValidationState({
          id: inputId + "-address-selector",
        })
      }
    })

    getAddresses.addEventListener('click', ev => {
      ev.preventDefault()
      this.getPossibleAddresses()
    })

    // First line needs to be handled by callback setAddressValidationState
  }

  setAddressValidationState = ({id, message}) => {
    const {inputId, setFormValidationState} = this.props
    // If we are clearing a validation error, do it
    if (!message) {
      setFormValidationState({id})
    }

    // Bad postcode
    if (this.state.postcodeValidationMessage) {
      // Validate the postcode
      if (id === inputId + "-postcode") {
        setFormValidationState({id, message})
      }
      // Don't validate the address selector - it will always fail
      // Validate first line if address if the address API has failed
      if (this.state.addressApiError && id === inputId + "-line-1") {
        setFormValidationState({id, message})
      }
      return
    }
    // Postcode is OK
    // When we have an API error, only validate the first line of the address
    if (this.state.addressApiError) {
      if (id === inputId + "-line-1") {
        setFormValidationState({id, message})
      }
      return
    }
    // API is fine, Address hasn't been selected
    if (this.state.addressSelectorValidationMessage) {
      if (id === inputId + "-address-selector") {
        setFormValidationState({id, message})
      }
      return
    }
    // Validate anything else
    setFormValidationState({id, message})
  }

  render() {
    const {inputId, label, validationIssues, visible} = this.props
    const setFormValidationState = this.setAddressValidationState

    const fieldsetClassNames = ["section", "fieldset-multi"]

    if (!visible) {
      fieldsetClassNames.push("is-hidden")
    }

    if (validationIssues.length > 0) {
      fieldsetClassNames.push("has-error")
    }

    const addressSelectorClasses = ["field"]

    if (this.state.addressSelectorOptions.length === 0) {
      addressSelectorClasses.push("is-hidden")
    }

    if (this.state.addressSelectorValidationMessage) {
      addressSelectorClasses.push("has-error")
    }

    const inputClasses = []

    if (!this.state.addressSelected && !this.state.addressApiError) {
      inputClasses.push("is-hidden")
    }

    return (
      <div>
        <fieldset
          className={fieldsetClassNames.join(" ")}>
          <ValidationSummary validationIssues={validationIssues} />
          <legend>
            <h2 className="title is-size-3">{label}</h2>
          </legend>
          <div
            className={"field " + (this.state.postcodeValidationMessage && " has-error")}>
            <label className={"label"} htmlFor={inputId + "-postcode"}>Find your
              address using your postcode</label>
            <p className="hint">For example, M3 4JR</p>
            {this.state.postcodeValidationMessage &&
            <p
              className="validation-message">{this.state.postcodeValidationMessage}</p>
            }
            <div className="field has-addons">
              <div className={"control"}>
                <input className="input" id={inputId + "-postcode"}
                       name={inputId + "-postcode"}
                       type={"text"} required={true}
                       pattern={"[A-Za-z]{1,2}[0-9][0-9A-Za-z]? ?[0-9][A-Za-z]{2}"}
                       autoComplete="postal-code"
                />
              </div>
              <div className={"control"}>
                <button id={inputId + "-get-addresses"} type="button"
                        className={"button is-primary"}>Find address
                </button>
              </div>
            </div>
            {this.state.addressApiError &&
            <p className="hint">Sorry! Our address lookup isn't working at the
              minute - please fill in the fields below.</p>
            }
            <div
              className={addressSelectorClasses.join(" ")}>
              <label className="label" htmlFor={inputId + "-address-selector"}>Select
                your address</label>
              {this.state.addressSelectorValidationMessage &&
              <p
                className="validation-message">{this.state.addressSelectorValidationMessage}</p>
              }
              <div className="control">
                <div className="select">
                  <select id={inputId + "-address-selector"}
                          name={inputId + "-address-selector"}
                          defaultValue={""}
                          required
                          className="is-expanded">
                    <option value="" key={"address-option-default"}>(Select your
                      address)
                    </option>
                    {this.state.addressSelectorOptions.map((option, i) => (
                      <option value={i} key={"address-option-" + i}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <InputText classNames={inputClasses} inputId={inputId + "-line-1"}
                       inputType={"text"}
                       setFormValidationState={setFormValidationState}
                       inputAttributes={{
                         required: true,
                       }} label={"First line of address"}
                       validationMessages={{
                         valueMissing: "Enter the first line of your address",
                       }} defaultValue={this.state.addressLine1} />
            <InputText classNames={inputClasses} inputId={inputId + "-line-2"}
                       inputType={"text"}
                       setFormValidationState={setFormValidationState}
                       label={"Second line of address"}
                       defaultValue={this.state.addressLine2} />
            <InputText classNames={inputClasses} inputId={inputId + "-line-3"}
                       inputType={"text"}
                       setFormValidationState={setFormValidationState}
                       label={"Third line of address"}
                       defaultValue={this.state.addressLine3} />
            <InputText classNames={inputClasses} inputId={inputId + "-town"}
                       inputType={"text"}
                       setFormValidationState={setFormValidationState}
                       label={"Town"}
                       validationMessages={{
                         valueMissing: "Enter your town",
                       }} defaultValue={this.state.town} />
            <InputText classNames={inputClasses} inputId={inputId + "-county"}
                       inputType={"text"}
                       setFormValidationState={setFormValidationState}
                       label={"County"} defaultValue={this.state.county} />
          </div>
          <input type="hidden" name="latitude" value={this.state.latitude} />
          <input type="hidden" name="longitude" value={this.state.longitude} />
        </fieldset>
      </div>
    )
  }
}

FieldsetAddress.propTypes = {
  getAddressApiKey: PropTypes.string.isRequired,
  inputId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  setFormValidationState: PropTypes.func.isRequired,
  validationIssues: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  })).isRequired,
  visible: PropTypes.bool.isRequired,
}

FieldsetAddress.defaults = {
  validationIssues: [],
}

export default FieldsetAddress
