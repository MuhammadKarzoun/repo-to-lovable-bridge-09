import { days, hours } from "@octobots/ui/src/constants/integrations";

import Button from "@octobots/ui/src/components/Button";
import ControlLabel from "@octobots/ui/src/components/form/Label";
import { FlexRow } from "@octobots/ui-inbox/src/settings/integrations/styles";
import FormGroup from "@octobots/ui/src/components/form/Group";
import { IOnlineHour } from "@octobots/ui-inbox/src/settings/integrations/types";
import Icon from "@octobots/ui/src/components/Icon";
import React from "react";
import Select from "react-select";
import styled from "styled-components";

const FillContent = styled.div`
  flex: 1;
  margin-inline-end: 5px;
`;

type Props = {
  prevOptions: any[];
  onChange: (onlineHours: IOnlineHour[]) => void;
};

type State = {
  onlineHours: IOnlineHour[];
};

class OnlineHours extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = { onlineHours: props.prevOptions || [] };
  }

  onTimeItemChange(onlineHourId, name, value) {
    const onlineHours = this.state.onlineHours;

    // find current editing one
    const onlineHour =
      onlineHours.find((hour) => hour._id === onlineHourId) || [];

    // set new value
    onlineHour[name] = value;

    this.setState({ onlineHours });

    // notify as change to main component
    this.props.onChange(onlineHours);
  }

  addTime = () => {
    const onlineHours = this.state.onlineHours.slice();

    onlineHours.push({
      _id: Math.random().toString(),
      day: days[0].value,
      from: hours[0].value,
      to: hours[0].value,
    });

    this.setState({ onlineHours });

    // notify as change to main component
    this.props.onChange(onlineHours);
  };

  removeTime = (onlineHourId) => {
    let onlineHours = this.state.onlineHours;

    onlineHours = onlineHours.filter((hour) => hour._id !== onlineHourId);

    this.setState({ onlineHours });

    // notify as change to main component
    this.props.onChange(onlineHours);
  };

  renderOnlineHour(onlineHour) {
    const remove = () => {
      this.removeTime(onlineHour._id);
    };

    const onDayChange = (e) => {
      this.onTimeItemChange(onlineHour._id, "day", e.value);
    };

    const onFromChange = (e) => {
      this.onTimeItemChange(onlineHour._id, "from", e.value);
    };

    const onToChange = (e) => {
      this.onTimeItemChange(onlineHour._id, "to", e.value);
    };

    const { _id, day, from, to } = onlineHour;
    return (
      <FlexRow key={_id}>
        <FillContent>
          <Select
            className="flex-item"
            value={days.find((o) => o.value === day)}
            options={days}
            onChange={onDayChange}
            isClearable={false}
          />
        </FillContent>

        <span>from</span>
        <FillContent>
          <Select
            className="flex-item"
            onChange={onFromChange}
            value={hours.find((o) => o.value === from)}
            options={hours}
            isClearable={false}
          />
        </FillContent>

        <span>to</span>
        <FillContent>
          <Select
            className="flex-item"
            onChange={onToChange}
            value={hours.find((o) => o.value === to)}
            options={hours}
            isClearable={false}
          />
        </FillContent>

        <Button size="small" btnStyle="danger" onClick={remove}>
          <Icon icon="cancel-1" />
        </Button>
      </FlexRow>
    );
  }

  render() {
    return (
      <FormGroup>
        <ControlLabel>Online hours</ControlLabel>

        {this.state.onlineHours.map((onlineHour) =>
          this.renderOnlineHour(onlineHour)
        )}

        <br />
        <Button
          btnStyle="success"
          size="small"
          onClick={this.addTime}
          icon="add"
        >
          Add another time
        </Button>
      </FormGroup>
    );
  }
}

export default OnlineHours;
