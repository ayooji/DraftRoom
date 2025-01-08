"use client";

import { useState } from "react";
import slugify from "slugify";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";

import ImageUpload from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Typography from "@/components/ui/typography";
import { useCreateWorkspaceValues } from "@/hooks/create-league-values";
import { createWorkspace } from "@/actions/create-workspace";
import { useRouter } from "next/navigation";

const CreateWorkspace = () => {
  const { currStep } = useCreateWorkspaceValues();

  let stepInView = null;

  switch (currStep) {
    case 1:
      stepInView = <Step1 />;
      break;
    case 2:
      stepInView = <Step2 />;
      break;
    default:
      stepInView = <Step1 />;
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-800 text-white">
      <div className="p-6 max-w-[550px] bg-white rounded-lg shadow-lg">
        <Typography
          text={`Step ${currStep} of 2`}
          variant="p"
          className="text-gray-600 text-center mb-4"
        />

        {stepInView}
      </div>
    </div>
  );
};

export default CreateWorkspace;

const Step1 = () => {
  const { name, updateValues, setCurrStep } = useCreateWorkspaceValues();

  return (
    <>
      <Typography
        text="Let's Get Your League Started!"
        className="my-4 text-2xl font-bold text-center text-gray-800"
      />

      <Typography
        text="Enter a unique name for your DraftRoom league. Choose something that represents your team and will be easily recognizable by your members."
        className="text-gray-600 text-center mb-6"
        variant="p"
      />

      <form className="mt-6">
        <fieldset>
          <Input
            className="bg-gray-100 text-gray-900 border border-gray-300 rounded-lg p-3 w-full"
            type="text"
            value={name}
            placeholder="Enter your league name"
            onChange={(event) => updateValues({ name: event.target.value })}
          />
          <Button
            type="button"
            className="mt-6 bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700"
            onClick={() => setCurrStep(2)}
            disabled={!name}
          >
            <Typography text="Next Step" variant="p" />
          </Button>
        </fieldset>
      </form>
    </>
  );
};

const Step2 = () => {
  const { setCurrStep, updateImageUrl, imageUrl, name } =
    useCreateWorkspaceValues();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const slug = slugify(name);
    const invite_code = uuid();
    const error = await createWorkspace({ imageUrl, name, slug, invite_code });
    setIsSubmitting(false);
    if (error?.error) {
      console.log(error);
      return toast.error("Couldn't create your league. Please try again.");
    }
    toast.success("League created successfully!");
    router.push("/");
  };

  return (
    <>
      <Button
        size="sm"
        className="text-blue-600 hover:underline mb-4"
        variant="link"
        onClick={() => setCurrStep(1)}
      >
        <Typography text="Back" variant="p" />
      </Button>

      <form>
        <Typography
          text="Upload a League Image"
          className="my-4 text-2xl font-bold text-center text-gray-800"
        />
        <Typography
          text="This image will represent your league. You can update it later in the league settings."
          className="text-gray-600 text-center mb-6"
          variant="p"
        />

        <fieldset
          disabled={isSubmitting}
          className="mt-6 flex flex-col items-center space-y-9"
        >
          <ImageUpload />
          <div className="space-x-5">
            <Button
              onClick={() => {
                updateImageUrl("");
                handleSubmit();
              }}
              className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg"
            >
              <Typography text="Skip for Now" variant="p" />
            </Button>

            {imageUrl ? (
              <Button
                type="button"
                onClick={handleSubmit}
                size="sm"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Typography text="Create League" variant="p" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                <Typography text="Select an Image" variant="p" />
              </Button>
            )}
          </div>
        </fieldset>
      </form>
    </>
  );
};