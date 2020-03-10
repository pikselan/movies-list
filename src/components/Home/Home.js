import React, { Component } from 'react';
import { API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE, BACKDROP_SIZE } from '../../config';
import './Home.css';

import HeroImage from '../elements/HeroImage/HeroImage';
import SearchBar from '../elements/SearchBar/SearchBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import MovieThumb from '../elements/MovieThumb/MovieThumb';
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn';
import Spinner from '../elements/Spinner/Spinner';

class Home extends Component {
  state = {
    heroImage: null,
    movies: [],
    loading: false,
    currentPage: 0,
    totalPages: 0,
    searchTerm: ''
  }

  componentDidMount() {
    if (localStorage.getItem('HomeState')) {
      const state = JSON.parse(localStorage.getItem('HomeState'));
      this.setState({...state});
    } else {
      this.setState({ loading: true })
      const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`
      this.fetchItems(endpoint)
    }
  }

  fetchItems = (endpoint) => {
    fetch(endpoint)
      .then(result => result.json())
      .then(result => {
        this.setState({
          movies: [...this.state.movies, ...result.results],
          heroImage: this.state.heroImage || result.results[0],
          loading: false,
          currentPage: result.page,
          totalPages: result.total_pages
        }, () => {
          if (this.state.searchTerm === "") {
            localStorage.setItem('HomeState', JSON.stringify(this.state))
          }
        })
      })
      .catch(err => console.error('error:', err))
  }

  searchItems = (searchTerm) => {
    let endpoint = '';
    this.setState({
      movies: [],
      loading: true,
      searchTerm
    })

    if (searchTerm === '') {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
    } else {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&query=${searchTerm}`;
    }

    this.fetchItems(endpoint);
  }

  render() {
    return (
      <div className="rmdb-home">
        {this.state.heroImage ? 
          <div>
            <HeroImage
              image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${this.state.heroImage.backdrop_path}`}
              title={this.state.heroImage.original_title}
              text={this.state.heroImage.overview}
            />
            <SearchBar callback={this.searchItems} />
          </div>
          : null  
        }

        <div className="rmdb-home-grid">
          <FourColGrid />

          {this.state.loading ? <Spinner /> : null}
          {(this.state.currentPage <= this.state.totalPages && !this.state.loading) ?
            <LoadMoreBtn text="Load More" />
            : null
          }
        </div>
      </div>
    )
  }
}

export default Home;