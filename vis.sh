#!/usr/bin/env bash

# INSTRUCTIONS
#
# Create a shell script named vis.sh that visualizes a file system's
# directory structure and takes two arguments:
#
# 1. `folder_path`:     The path to a directory whose structure you
#    want to visualize
# 2. `output_filename`: The name for the output PDF file (e.g.,
#    structure.pdf)
#
# Script Requirements:
#
# - Visualizing the Structure: Use the `dot` language (install GraphViz)
#   to generate a hierarchical representation of the directory
# - Traverse the Directory: Use the `find` command to list all files and
#   subdirectories within the specified `folder_path`
# - Generate `dot` Syntax: Use the `sed` command to process the output from
#   find and transform it into a valid `dot` syntax string
# - Save the Output: The final command should resemble `... | dot -Tpdf-o
#   <output_filename>`, which will save the generated diagram as a PDF file
