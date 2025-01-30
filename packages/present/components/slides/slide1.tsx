import Slide from "../templates/base";

export default function Slide1({ className }: { className: string }) {
  return (
    <Slide>
      <div className={`${className} h-full`}>
        <h1>Slide 1</h1>
        <p>Slide 1 content</p>
      </div>
    </Slide>
  );
}
