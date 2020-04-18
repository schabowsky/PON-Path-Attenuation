import React, {Component} from "react";
import _ from "lodash";
import NumericInput from "./NumericInput";
import {attenuations, defaultState} from "./constants";


class CalculationPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...defaultState,
            attenuation: 0,
            attenuation_sd: 0
        }
    }

    handleChange = (name, value) => {
        this.setState({[name]: value}, this.calculateAttenuation)
    };

    calculateAttenuation = () => {
        const {m, s_w, s_0, k, c_w, c_0, l, f_w, f_0} = this.state;
        const factor = [2, 4, 6, 8, 16, 32, 64];
        const b_w_sum = _.sum(_.map(factor, f =>
            this.state[`b_${f}`] * this.state[`b_w_${f}`]));
        const b_0_sum = _.sum(_.map(factor, f =>
            this.state[`b_${f}`] * (this.state[`b_0_${f}`] ** 2)));

        const m_w_sum = 0, m_0_sum = 0;
        this.setState({
            attenuation: ((m * s_w) + (k * c_w) + (l * f_w) + b_w_sum + m_w_sum).toFixed(2),
            attenuation_sd: (3 * Math.sqrt((m * s_0 * s_0) + (k * c_0 * c_0) + (l * f_0 * f_0) + b_0_sum + m_0_sum)).toFixed(2)
        })
    };

    render() {
        return (
            <div className="container">
                <span className={"title-col"}>Tłumienność toru optycznego w sieci PON</span>
                <div style={{marginBottom: 20}}>
                    <input readOnly
                           value={`${this.state.attenuation} ± ${this.state.attenuation_sd}`}/>
                    <span>dB</span>
                </div>
                <div className="form">
                    <div style={{marginRight: 20}}>
                        <div className={"name"}>Element sieci PON</div>
                        {_.map(attenuations, a => <div>
                            <div className={"row-name"}>{a.name}</div>
                        </div>)}
                    </div>
                    <div style={{marginRight: 20}}>
                        <div className={"name"}>
                            Ilość
                        </div>
                        {_.map(attenuations, a => <div>
                            <NumericInput
                                value={this.state[a.sign]}
                                onChange={value => this.handleChange(a.sign, value)}
                            />
                        </div>)}
                    </div>
                    <div style={{marginRight: 20}}>
                        <div className={"name"}>
                            Średnia tłumienność [dB]
                        </div>
                        {_.map(attenuations, a => <div>
                            <NumericInput
                                value={this.state[a.attenuation]}
                                onChange={value => this.handleChange(a.attenuation, value)}
                            />
                        </div>)}
                    </div>
                    <div style={{marginRight: 20}}>
                        <div className={"name"}>
                            Odchylenie standardowe tłumienności [dB]
                        </div>
                        {_.map(attenuations, a => <div>
                            <NumericInput
                                value={this.state[a.attenuation_sd]}
                                onChange={value => this.handleChange(a.attenuation_sd, value)}
                            />
                        </div>)}
                    </div>
                </div>
            </div>
        )
    }
}

export default CalculationPanel;
