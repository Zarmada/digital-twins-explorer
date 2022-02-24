// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { Component } from "react";
import { DetailsList, SelectionMode } from "@fluentui/react/lib/DetailsList";
import LoaderComponent from "../LoaderComponent/LoaderComponent";

import "./TabularViewComponent.scss";

export class TabularViewComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      items: this.generateItems(),
      columns: this.generateColumns()
    };
  }

  componentDidMount = () => {
    this.setState({ isLoading: false });
  }

  generateItems = () => {
    const items = [];
    this.props.relationships.forEach(element => {
      const item = {};
      item.name = element.$relationshipName;
      item.source = element.$sourceId;
      item.target = element.$targetId;
      item.id = element.$relationshipId;
      items.push(item);
    });
    return items;
  }

  generateColumns = () => [
    {
      key: "nameColumn",
      fieldName: "name",
      name: "Name",
      data: "string",
      minWidth: 200,
      maxWidth: 200,
      isPadded: true
    }, {
      key: "sourceColumn",
      fieldName: "source",
      name: "Source",
      data: "string",
      minWidth: 200,
      maxWidth: 200,
      isPadded: true
    }, {
      key: "targetColumn",
      fieldName: "target",
      name: "Target",
      data: "string",
      minWidth: 200,
      maxWidth: 200,
      isPadded: true
    }, {
      key: "idColumn",
      fieldName: "id",
      name: "Relationship ID",
      data: "string",
      minWidth: 200,
      maxWidth: 200,
      isPadded: true
    }
  ]

  render() {
    const { isLoading, items, columns } = this.state;
    return (
      <div className="ev-grid">
        <DetailsList
          items={items}
          columns={columns}
          isHeaderVisible
          selectionMode={SelectionMode.none}
          width="800px" />
        {isLoading && <LoaderComponent />}
      </div>
    );
  }

}
