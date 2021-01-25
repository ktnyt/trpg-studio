import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome'

export type IconProps = FontAwesomeIconProps

export const Icon = (props: IconProps) => {
  return <FontAwesomeIcon {...props} />
}
