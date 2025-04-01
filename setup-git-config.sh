#!/bin/bash
git config merge.ours.name "Keep ours merge driver"
git config merge.ours.driver "true"
git config merge.theirs.name "Keep theirs merge driver"
git config merge.theirs.driver "true"

echo "Git merge drivers configured successfully!"