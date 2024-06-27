import { Text, TextProps } from './Themed';

export function JoseBoldText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'JosefineBold' }]} />;
}

export function JoseRegularText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'JosefineBoldRegular' }]} />;
}

export function JoseSemiBoldText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'JosefineBoldSemiBold' }]} />;
}