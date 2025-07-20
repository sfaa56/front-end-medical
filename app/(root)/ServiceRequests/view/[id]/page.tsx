"use client";
import Link from "next/link";
import { FiUpload } from "react-icons/fi";
import React, { useRef, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { FaBriefcase } from "react-icons/fa";
import { FiEdit, FiTrash2, FiMessageCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Page() {
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const request = {
    assignedProvider: "Provider One",
    cost: "500$",
    status: "In Progress",
    postDate: "4 days ago",
    estimateTime: "3 days",
    specialty: "Plumbing",
    title: "Fix kitchen sink leak",
    description:
      "There is a leak under the kitchen sink that needs urgent repair.",
    attachments: [
      { name: "photo1.jpg", url: "#" },
      { name: "invoice.pdf", url: "#" },
    ],
    offers: [
      {
        provider: "Provider One",
        price: "$50",
        message: "Can do it tomorrow.",
      },
      { provider: "Provider Two", price: "$45", message: "Available today." },
    ],
  };

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingAttachments, setIsEditingAttachments] = useState(false);

  const [editAttachments, setEditAttachments] = useState([
    ...request.attachments,
  ]);

  const [editInfo, setEditInfo] = useState({
    status: request.status,
    postDate: request.postDate,
    estimateTime: request.estimateTime,
    cost: request.cost,
    specialty: request.specialty,
  });

  const [editDetails, setEditDetails] = useState({
    description: request.description,
  });

  // Handlers for Info section
  const handleEditInfoChange = (e: any) => {
    const { name, value } = e.target;
    setEditInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveInfo = () => {
    Object.assign(request, editInfo);
    setIsEditingInfo(false);
  };

  const handleCancelInfo = () => {
    setEditInfo({
      status: request.status,
      postDate: request.postDate,
      estimateTime: request.estimateTime,
      cost: request.cost,
      specialty: request.specialty,
    });
    setIsEditingInfo(false);
  };

  // Handlers for Details section
  const handleEditDetailsChange = (e: any) => {
    const { name, value } = e.target;
    setEditDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDetails = () => {
    request.description = editDetails.description;
    setIsEditingDetails(false);
  };

  const handleCancelDetails = () => {
    setEditDetails({ description: request.description });
    setIsEditingDetails(false);
  };

  const handleAddAttachment = (e: any) => {
    const files = Array.from(e.target.files) as File[];
    setEditAttachments((prev) => [
      ...prev,
      ...files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        file,
      })),
    ]);
  };

  const handleRemoveAttachment = (idx: any) => {
    setEditAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveAttachments = () => {
    request.attachments = editAttachments;
    setIsEditingAttachments(false);
  };

  const handleCancelAttachments = () => {
    setEditAttachments([...request.attachments]);
    setIsEditingAttachments(false);
  };

  // Mock data (replace with real data/fetch)
  const client = {
    name: "Ahmed Ali",
    registerDate: "2023-01-15",
    city: "Cairo",
    email: "ahmed.ali@email.com",
  };

  const offers = [
    {
      provider: "Provider One",
      avatar: "https://i.pravatar.cc/40?img=21",
      specialty: "Plumber",
      rating: 4.8,
      price: "$50",
      estimateTime: "1 day",
      message: "Can do it tomorrow.",
    },
    {
      provider: "Provider Two",
      avatar: "https://i.pravatar.cc/40?img=22",
      specialty: "Handyman",
      rating: 4.6,
      price: "$45",
      estimateTime: "2 days",
      message: `Available today 
Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe veniam ipsa nisi itaque ipsum minus alias, fugiat nobis numquam fugit eius pariatur assumenda ut qui provident, rem soluta quo eveniet?  nulla mollitia illo numquam asperiores ratione voluptate enim
              officiis nostrum? Praesentium veritatis repellendus amet
              architecto pariatur consectetur? Lorem ipsum, dolor sit amet
              consectetur adipisicing elit. Blanditiis, facilis optio? Libero
              eius molestiae modi numquam recusandae accusantium non explicabo
              saepe consequuntur amet, labore officiis laudantium placeat sit.
              Voluptate, explicabo? nulla mollitia illo numquam asperiores ratione voluptate enim
              officiis nostrum? Praesentium veritatis repellendus amet
              architecto pariatur consectetur? Lorem ipsum, dolor sit amet
              consectetur adipisicing elit. Blanditiis, facilis optio? Libero
              eius molestiae modi numquam recusandae accusantium non explicabo
              saepe consequuntur amet, labore officiis laudantium placeat sit.
              Voluptate, explicabo? nulla mollitia illo numquam asperiores ratione voluptate enim
              officiis nostrum? Praesentium veritatis repellendus amet
              architecto pariatur consectetur? Lorem ipsum, dolor sit amet
              consectetur adipisicing elit. Blanditiis, facilis optio? Libero
              eius molestiae modi numquam recusandae accusantium non explicabo
              saepe consequuntur amet, labore officiis laudantium placeat sit.
              Voluptate, explicabo?
    `,
    },
  ];

  return (
    <div className="flex flex-col mx-[20px] mb-10">
      <nav
        className="flex items-center text-sm text-gray-500 mb-4"
        aria-label="Breadcrumb"
      >
        <Link href={"/overview"}>
          <span className="hover:underline cursor-pointer ">Home</span>
        </Link>
        <FiChevronRight className="mx-2" />

        <Link href={"/ServiceRequests"}>
          <span className="hover:underline cursor-pointer ">
            Service Requests
          </span>
        </Link>
        <FiChevronRight className="mx-2" />
        <span className=" t">View</span>
      </nav>

      {/* title and buttons */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6  ">
        {/* Left: Request Title */}
        <h1 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0">
          {request.title}
        </h1>
        {/* Right: Action Buttons */}
        <div className="flex gap-3">
          <Button
            className="border flex items-center gap-1 rounded text-secondary bg-secondary bg-opacity-10 hover:bg-secondary hover:bg-opacity-20 transition"
            title="Comment"
            onClick={() => {
              commentRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              setTimeout(() => commentRef.current?.focus(), 400);
            }}
          >
            <FiMessageCircle />
            <span className="hidden sm:inline">Comment</span>
          </Button>

    

       <AlertDialog>
            <AlertDialogTrigger asChild>
          <Button
            className=" flex items-center gap-1 px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-200 transition"
            title="Delete"
          >
            <FiTrash2 />
            <span className="hidden sm:inline">Delete</span>
          </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-2">
                  <FiTrash2 className="text-2xl text-red-500" />
                </div>
                <AlertDialogTitle className="text-lg font-bold text-red-600">
                  Delete Request
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription className="text-center text-gray-600 mb-4">
                Are you sure you want to{" "}
                <span className="font-semibold text-red-500">delete</span> Request{" "}
                <span className="font-semibold">Requst</span>?<br />
                This action cannot be undone.
              </AlertDialogDescription>
              <AlertDialogFooter className="flex justify-center gap-2">
                <AlertDialogCancel
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(event) => {
                    event.stopPropagation();
    
                  }}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>


        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 ">
        {/* Left Column */}
        <div className="md:w-[28%] w-full space-y-5">
          {/* Service Request Info */}
          <div className="bg-white rounded-sm shadow p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium">Request Info</h2>
              {!isEditingInfo && (
                <button
                  className="text-xs px-2 py-1 rounded  text-secondary border   transition    shadow  hover:bg-secondary hover:bg-opacity-5"
                  onClick={() => setIsEditingInfo(true)}
                >
                  Update
                </button>
              )}
            </div>
            <div className="-mx-4 w-[calc(100%+2rem)] h-[1px] bg-gray-300 my-3 mb-4"></div>

            <div className="flex gap-[146px] text-sm">
              <div
                className={`${
                  isEditingInfo ? "gap-4" : "gap-2"
                } flex  flex-col`}
              >
                <span className="font-medium mb-2">Status </span>
                <span className="font-medium">Post Date </span>
                <span className="font-medium">Estimate</span>
                <span className="font-medium">Cost</span>
                <span className="font-medium">Specialty </span>
              </div>

              <div className="flex gap-2 flex-col">
                {isEditingInfo ? (
                  <>
                    <select
                      name="status"
                      value={editInfo.status}
                      onChange={handleEditInfoChange}
                      className="px-2 py-1 rounded border"
                    >
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Waiting">Waiting</option>
                    </select>
                    <input
                      name="postDate"
                      value={editInfo.postDate}
                      onChange={handleEditInfoChange}
                      className="px-2 py-1 rounded border"
                    />
                    <input
                      name="estimateTime"
                      value={editInfo.estimateTime}
                      onChange={handleEditInfoChange}
                      className="px-2 py-1 rounded border"
                    />
                    <input
                      name="cost"
                      value={editInfo.cost || ""}
                      onChange={handleEditInfoChange}
                      className="px-2 py-1 rounded border"
                      placeholder="Cost"
                    />
                    <input
                      name="specialty"
                      value={editInfo.specialty}
                      onChange={handleEditInfoChange}
                      className="px-2 py-1 rounded border"
                    />
                  </>
                ) : (
                  <>
                    <span
                      className={`px-2 py-1 mb-2 rounded-full text-xs font-semibold
                ${
                  request.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : request.status === "In Progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
                    >
                      {request.status}
                    </span>
                    <span>{request.postDate}</span>
                    <span>{request.estimateTime}</span>
                    <span>{request.cost}</span>
                    <span>{request.specialty}</span>
                  </>
                )}
              </div>
            </div>
            {isEditingInfo && (
              <div className="flex gap-2 mt-4">
                <Button variant={"submit"} onClick={handleSaveInfo}>
                  Save
                </Button>
                <Button variant={"cancel"} onClick={handleCancelInfo}>
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Client Details */}
          <div className="bg-white rounded-sm shadow p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium">Client Details</h2>
              <button className="text-xs px-2 py-1 rounded  text-secondary border   transition   shadow  hover:bg-secondary hover:bg-opacity-10">
                View
              </button>
            </div>

            <div className="-mx-4 w-[calc(100%+2rem)] h-[1px] bg-gray-300 my-3"></div>

            <div className="space-y-3 text-sm">
              <div>
                {client.name}
                <span className="flex items-center gap-1 text-gray-500 text-xs">
                  <FaBriefcase /> Doctor
                </span>
              </div>

              <div className="flex  gap-20">
                <div className="flex flex-col gap-2">
                  <span className="font-medium ">Register</span>
                  <span className="font-medium ">Email </span>

                  <span className="font-medium ">City </span>
                  <span className="font-medium ">Open Services </span>
                  <span className="font-medium ">Inprogress Services </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span>{client.registerDate}</span>
                  <span> {client.email}</span>

                  <span> {client.city}</span>
                  <span>6</span>
                  <span>2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comment */}

          <div className="bg-white rounded-sm shadow p-4 mt-8">
            <h2 className="text-base font-medium mb-2">Leave a Comment</h2>
            <textarea
              ref={commentRef}
              className="w-full min-h-[255px] border rounded p-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Write your comment here..."
            />
            <Button variant={"submit"} className="mt-2">
              Send
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 w-full space-y-5">
          {/* Request Details */}
          <div className="bg-white rounded-sm shadow p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium">Request Details</h2>
              {!isEditingDetails && (
                <button
                  className="text-xs px-2 py-1 rounded  text-secondary border   transition   shadow  hover:bg-secondary hover:bg-opacity-5"
                  onClick={() => setIsEditingDetails(true)}
                >
                  Update
                </button>
              )}
            </div>
            <div className="-mx-4 w-[calc(100%+2rem)] h-[1px] bg-gray-300 my-3"></div>
            {isEditingDetails ? (
              <div>
                <textarea
                  name="description"
                  value={editDetails.description}
                  onChange={handleEditDetailsChange}
                  className="w-full min-h-[120px] border rounded p-2 mb-2"
                />
                <div className="flex gap-2">
                  <Button variant={"submit"} onClick={handleSaveDetails}>
                    Save
                  </Button>
                  <Button variant={"cancel"} onClick={handleCancelDetails}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-2">{request.description}</div>
            )}
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-sm shadow p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium">Attachments</h2>
              {!isEditingAttachments && (
                <button
                  className="text-xs px-2 py-1 rounded text-secondary border transition shadow hover:bg-secondary hover:bg-opacity-5"
                  onClick={() => setIsEditingAttachments(true)}
                >
                  Update
                </button>
              )}


              
            </div>
            <div className="-mx-4 w-[calc(100%+2rem)] h-[1px] bg-gray-300 my-3"></div>
            {isEditingAttachments ? (
              <div>
                <ul className="list-disc pl-5 space-y-1 mb-2">
                  {editAttachments.map((att, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <a
                        href={att.url}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {att.name}
                      </a>
                      <button
                        className="text-xs text-red-500 hover:underline"
                        onClick={() => handleRemoveAttachment(idx)}
                        type="button"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                {/* Styled file input */}
                <div className="mb-6">
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleAddAttachment}
                    className="hidden"
                  />
                </div>
                <div className="flex gap-2">
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-1 rounded bg-secondary text-white flex items-center text-sm hover:bg-secondary/90 hover:cursor-pointer"
                  >
                    <FiUpload className="mr-2 text-sm" />
                    Add Files
                  </label>
                  <Button variant={"submit"} onClick={handleSaveAttachments}>
                    Save
                  </Button>
                  <Button variant={"cancel"} onClick={handleCancelAttachments}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {request.attachments.map((att, idx) => (
                  <li key={idx}>
                    <a
                      href={att.url}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {att.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Offers */}
          <div className="bg-white rounded-sm shadow p-4">
            <h2 className="text-base font-medium"> Provider Offers</h2>
            <div className="-mx-4 w-[calc(100%+2rem)] h-[1px] bg-gray-300 my-3"></div>

            <ul className="space-y-4">
              {offers.map((offer, idx) => {
                const isAssigned =
                  request.status === "In Progress" &&
                  offer.provider === request.assignedProvider;
                return (
                  <li
                    key={idx}
                    className={`border rounded p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4 bg-gray-50 ${
                      isAssigned ? "border-secondary bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-4 min-w-[220px]">
                        <img
                          src={offer.avatar}
                          alt={offer.provider}
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                        <div>
                          <div className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="hover:text-secondary hover:cursor-pointer">
                              {offer.provider}
                            </span>
                            <span className="flex items-center text-yellow-500 text-xs ml-2">
                              ★ {offer.rating}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {offer.specialty}
                          </div>
                        </div>
                      </div>

                      <div className={`flex ${isAssigned?"justify-between":"justify-end "}  items-end gap-1 min-w-[90px]`}>
                        {isAssigned && (
                          <span className="ml-2 px-2 py-0.5 rounded bg-secondary text-white text-xs">
                            Working
                          </span>
                        )}

                        <div className="flex flex-col  ">
                          <span className="text-lg font-bold text-secondary">
                            {offer.price}
                          </span>
                          <span className="text-xs text-gray-500">
                            {offer.estimateTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 text-gray-600 text-sm break-words">
                      {offer.message}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
