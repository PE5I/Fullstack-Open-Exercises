import { useSelector } from 'react-redux'
import { connect } from 'react-redux'

const Notification = (props) => {
  // const notification = useSelector(state => state.notification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  if (props.notification.message && props.notification.message !== '') {
    return (
      <div style={style}>
        {props.notification.message}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}

export default connect(
  mapStateToProps
)(Notification)
