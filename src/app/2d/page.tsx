import SingleColor from '@/samples/2d/SingleColor/SingleColor';
import { convertColorIntoFloat } from '@/util/math/color';

export default function Home() {
  return (
    <>
      <h1>Please select 2d samples from sub navigation bar</h1>
      <SingleColor backgroundColor={convertColorIntoFloat(252, 245, 237)} />
    </>
  );
}
