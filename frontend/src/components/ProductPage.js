import React from "react";
import axios from "axios";
import {Card, Button} from "react-bootstrap";
import {GridList, GridListTile} from "@material-ui/core";
import user from "../App";
axios.defaults.withCredentials = true

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

let styles = {
    marginRight: '21px',
    width: '25rem',
    height:'35rem',
    marginBottom:'5rem',
    border:"0"
};
const ProductProp = props => {
    let productName = props.product.name;
    // I JUST SPENT CLOSE TO 30 MINUTES TO FIND OUT THAT YOU NEED TO .DEFAULT THIS IN ORDER FOR WEBPACK TO RETURN THE CORRECT PATH
    const image = require('../static/img/' + props.product.name + '.jpg').default;
    return (
    <Card style={styles}>
        <a href = {"/" + props.product.type + "s/"+ props.product.name}><Card.Img variant="top" src={image} /> </a>
        <Card.Body>
            <Card.Title>{props.product.title} (${props.product.price})</Card.Title>
            <hr></hr>
            <Button variant="primary" onClick={() => {}}> Purchase </Button>
            <Button className="float-right" variant="danger" onClick={() => {props.deleteProduct(props.product)}}>Delete</Button>
            <Button className="float-right" variant="warning" onClick={() => {props.editProduct(props.product.name)}}> Edit </Button>
        </Card.Body>

    </Card>
    );
}


export default class ProductPage extends React.Component {
    constructor(props) {
        super(props);
        this.editProduct = this.editProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.setSort = this.setSort.bind(this);
        this.state = {
            products : {},
            sort: 0
        }
    }

    editProduct(productName) {
        this.props.history.push('/' + this.props.type + "s/edit/" + productName);
    }

    deleteProduct(product) {
        axios.delete("http://localhost:8080/product/delete/" + product.name)
          .then(res => {
              // Refresh page
              window.location.reload();
          }).catch(err => {
              alert (err);
          })
    }
    componentDidMount() {
        axios.get("http://localhost:8080/product/")
            .then(res => {
                // Filter the array by type(smartphone, laptop etc)
                // Would've probably been better to do this on the backend via custom queries
                // But this works too and I'm too lazy atm
                let array = (this.props.type === "electronic") ? Array.from(res.data) : Array.from(res.data).filter(element => element.type === this.props.type);
                this.setState({
                    products : array
                })
            })
            .catch(err => {
                alert(err);
            });
    }

    productList() {
        return Array.from(this.state.products);
    }

    setSort(sortOrder) {
        this.setState({
            sort: sortOrder
        })
        let array = Array.from(this.state.products);
        if (!this.setState) array.sort((a, b) => (a.price > b.price) ? 1 : -1);
        else array.sort((a, b) => (a.price > b.price) ? -1 : 1);  
        this.setState({
            products: array
        })
       // window.location.reload();
    } 
    render() {
        let productArray = this.productList();
        return (
          <div>
            <h3>{capitalizeFirstLetter(this.props.type) + "s"}</h3>
            <h3>Sort by price : <a href="" onClick={() => {this.setSort(0)}}>ascending</a> | <a href="" onClick={() => {this.setSort(1)}}>descending</a></h3>
            <GridList cols={3}>
        {
            productArray.map(currentProduct => {
                return (
                <GridListTile style={styles}>
                    <ProductProp product={currentProduct} editProduct={this.editProduct} deleteProduct={this.deleteProduct}/>
                </GridListTile>
                )
            })
        }
        </GridList>
   
          </div>
        )
      }
}