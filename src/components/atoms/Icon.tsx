import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome'

export type IconProps = FontAwesomeIconProps

const Icon = (props: IconProps) => {
  return <FontAwesomeIcon {...props} />
}

export default Icon
