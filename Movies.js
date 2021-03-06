import React from 'react'
import {
  Text,
  View,
  ListView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import * as api from './api'
import MovieCell from './MovieCell'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255, 187, 36)',
  },
  centering: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

class Movies extends React.Component {
  static propTypes = {
    onSelectMovie: React.PropTypes.func.isRequired,
    tabIndex: React.PropTypes.number.isRequired,
  }

  state = {
    isError: false,
    isLoading: true,
    isEmpty: false,
    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
    refreshing: false,
  }

  componentDidMount() {
    this.fetchMovies()
  }

  fetchMovies () {
    this.setState({ isLoading: true })
    if (this.props.tabIndex === 1) {
      api.fetchNowPlayingMovies()
      .then(results => this.updateRows(results))
      .catch(error => {
        this.setState({
          refreshing: false,
          isLoading: false,
          isError: true,
        })
        console.error(error)
      })
    } else {
      api.fetchTopRatedMovies()
      .then(results => this.updateRows(results))
      .catch(error => {
        this.setState({
          refreshing: false,
          isLoading: false,
          isError: true,
        })
        console.error(error)
      })
    }
  }

  _onRefresh() {
    this.setState({refreshing: true})
    this.fetchMovies()
  }

  updateRows(rows) {
    this.setState({
      isLoading: false,
      refreshing: false,
      isEmpty: rows.length === 0,
      dataSource: this.state.dataSource.cloneWithRows(rows),
    })
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={[ styles.container, styles.centering ]}>
          <ActivityIndicator />
        </View>
      )
    } else if (this.state.isEmpty) {
      return (
        <View style={[ styles.container, styles.centering ]}>
          <Text>No results found</Text>
        </View>
      )
    } else if (this.state.isError) {
      return (
        <View style={[ styles.container, styles.centering ]}>
          <Text>Network Error</Text>
        </View>
      )
    }
    return (
      <ListView
        removeClippedSubviews={false}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={row => (
          <TouchableOpacity onPress={() => this.props.onSelectMovie(row)}>
            <MovieCell movie={row} />
          </TouchableOpacity>
        )}
      />
    )
  }
}

export default Movies;
