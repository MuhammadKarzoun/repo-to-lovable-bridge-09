import {
  Actions,
  IframePreview,
  Template,
  TemplateBox,
  TemplateBoxInfo,
  TemplateInfo,
  Templates,
} from "@octobots/ui-emailtemplates/src/styles";
import { FlexRow } from "@octobots/ui-settings/src/styles";

import React, { useState } from "react";
import { __, router } from "coreui/utils";

import Form from "@octobots/ui-inbox/src/settings/responseTemplates/components/Form";
import { FormControl } from "@octobots/ui/src/components/form";
import HeaderDescription from "@octobots/ui/src/components/HeaderDescription";
import { IButtonMutateProps } from "@octobots/ui/src/types";
import { ICommonListProps } from "@octobots/ui-settings/src/common/types";
import Icon from "@octobots/ui/src/components/Icon";
import List from "@octobots/ui-settings/src/common/components/List";
import ModalTrigger from "@octobots/ui/src/components/ModalTrigger";
import SelectBrands from "@octobots/ui/src/brands/containers/SelectBrands";

type Props = {
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  queryParams: any;
  location: any;
  navigate: any;
} & ICommonListProps;

const ResponseTemplateList: React.FC<Props> = ({
  renderButton,
  queryParams,
  location,
  navigate,
  ...props
}) => {
  const [searchValue, setSearchValue] = useState<string>(
    queryParams && queryParams.searchValue ? queryParams.searchValue : ""
  );

  const onChange = (e: React.FormEvent) => {
    const { value } = e.currentTarget as HTMLInputElement;
    setSearchValue(value);
  };

  const renderForm = (props) => {
    return <Form {...props} renderButton={renderButton} />;
  };

  const renderEditAction = (object) => {
    const { save } = props;

    const content = (props) => {
      return renderForm({ ...props, object, save });
    };

    return (
      <ModalTrigger
        enforceFocus={false}
        title="Edit"
        hideHeader
        size="xl"
        trigger={
          <div>
            <img src="/images/edit-white-filled.svg" />
          </div>
        }
        content={content}
      />
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<Element>) => {
    if (e.key === "Enter") {
      const { value, name } = e.currentTarget as HTMLInputElement;
      router.setParams(navigate, location, { [name]: value });
    }
  };

  const onSelect = (values: string[] | string, name: string) => {
    router.setParams(navigate, location, { [name]: values });
  };

  const renderFilters = () => {
    const brandId =
      queryParams && queryParams.brandId ? queryParams.brandId : "";

    return (
      <FlexRow $alignItems='flex-start'>
        <FormControl
          placeholder={__("Type to search")}
          name="searchValue"
          onChange={onChange}
          value={searchValue}
          onKeyPress={handleKeyDown}
          onKeyDown={handleKeyDown}
          autoFocus={true}
        />
        <SelectBrands
          label="Filter by brand"
          initialValue={brandId}
          onSelect={onSelect}
          name="brandId"
          multi={false}
        />
      </FlexRow>
    );
  };

  const renderContent = () => {
    const { remove, objects } = props;

    return (
      <Templates>
        {objects.map((object, index) => (
          <Template
            key={index}
            $isLongName={object.name > 45}
            position="flex-start"
          >
            <TemplateBox $hasPadding={true}>
              <Actions>
                {renderEditAction(object)}
                <div onClick={() => remove(object._id)}>
                  <img src="/images/delete-white-filled.svg" />
                </div>
              </Actions>
              <IframePreview>
                <iframe title="response-iframe" srcDoc={object.content} />
              </IframePreview>
            </TemplateBox>
            <TemplateBoxInfo>
              <h5 style={{ color: '#1F97FF' }} >{object.name}</h5>
              <TemplateInfo>
                <p>Brand</p>
                <p>{object.brand.name}</p>
              </TemplateInfo>
            </TemplateBoxInfo>
          </Template>
        ))}
      </Templates>
    );
  };

  return (
    <List
      formTitle="New response template"
      breadcrumb={[
        { title: __("Settings"), link: "/settings" },
        { title: __("Response templates") },
      ]}
      title={__("Response templates")}
      // leftActionBar={
      //   <HeaderDescription
      //     icon="/images/actions/24.svg"
      //     title="Response templates"
      //     description={`${__(
      //       "Make things easy for your team members and add in ready made response templates"
      //     )}.${__(
      //       "Manage and edit your response templates according to each situation and respond in a timely manner and without the hassle"
      //     )}`}
      //   />
      // }
      additionalButton={renderFilters()}
      renderForm={renderForm}
      renderContent={renderContent}
      size="lg"
      {...props}
    />
  );
};

export default ResponseTemplateList;
 