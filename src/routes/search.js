import React, { Component } from "react";
import PatientPage from "./patients";
import SearchForm from "../components/SearchForm";
import Header from "../components/Header";
import request from "../javascript/api";
import { Layout, message, Pagination, Row, Col, Modal } from "antd";
import "./search.css";
const { Content } = Layout;

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchContent: null
    };
  }

  searchPatient = query => {
    console.log("received search request: ", query);
    //check if all the field is empty except exact macth search checkbox
    let queryClone = Object.assign({}, query);
    delete queryClone.exactMatch;
    const isEmpty = Object.values(queryClone).every(x => x === undefined || x === null || x === "");
    if (isEmpty) {
      Modal.warning({
        title: "Recherche échouée",
content: "Au moins un champ est requis pour filtrer les résultats"
});
return;
}
if (query.anythingElse) {
  message.loading(
    "Vous avez saisi une requête pour rechercher tout, cela peut prendre un certain temps et votre navigateur peut figer, veuillez attendre que le navigateur réponde."
  );
      setTimeout(() => {
        this.setState({ searchContent: query });
      }, 1000);
    } else {
      this.setState({
        searchContent: query
      });
    }
  };

  render() {
    return (
      <div>
        <Header title="Recherche avancée"></Header>
        <SearchForm searchRequest={this.searchPatient}></SearchForm>
        {this.state.searchContent && <PatientPage filter={this.state.searchContent} />}
      </div>
    );
  }
}

export default SearchPage;
